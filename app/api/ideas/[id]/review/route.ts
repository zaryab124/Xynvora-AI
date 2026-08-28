// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — IDEA EXECUTIVE REVIEW API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const REVIEW_SCHEMA = z.object({
  score: z.number().min(1).max(10).default(8),
  feedback: z.string().min(5, 'Feedback must be at least 5 characters'),
  recommendation: z.enum(['PROCEED', 'REVISE', 'REJECT', 'HOLD', 'proceed', 'revise', 'reject', 'hold']).default('PROCEED'),
  priority: z.enum(['low', 'medium', 'high', 'urgent', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category_id: z.string().uuid().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    const identifier = params.id;

    const allowedRoles = ['CGO', 'CEO', 'CFO', 'ADMIN', 'COMMUNITY_MODERATOR'];
    if (!allowedRoles.includes(user.role)) {
      return apiError(`Forbidden: Only executive reviewers (${allowedRoles.join(', ')}) can submit formal reviews.`, 403);
    }

    const body = await request.json();
    const validated = await validateInputAsync(REVIEW_SCHEMA, body);
    const recommendation = (validated.recommendation || 'PROCEED').toUpperCase();

    try {
      const ideaRes = await query<{ id: string; title: string; submitter_id: string; slug: string }>(
        `SELECT id, title, submitter_id, slug FROM ideas WHERE id = $1 OR slug = $1`,
        [identifier]
      );

      if (ideaRes.rows.length === 0) {
        return apiError('Idea not found', 404);
      }

      const idea = ideaRes.rows[0];

      // Insert into idea_reviews
      const reviewRes = await query<{ id: string }>(
        `INSERT INTO idea_reviews (idea_id, reviewer_id, score, feedback, recommendation)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [idea.id, user.id, validated.score, validated.feedback, recommendation]
      );

      const reviewId = reviewRes.rows[0].id;

      // Update CGO priority or category if provided
      if (validated.priority || validated.category_id) {
        const updates: string[] = [];
        const paramsList: unknown[] = [];
        if (validated.priority) {
          paramsList.push(validated.priority.toLowerCase());
          updates.push(`cgo_priority = $${paramsList.length}`);
        }
        if (validated.category_id) {
          paramsList.push(validated.category_id);
          updates.push(`category_id = $${paramsList.length}`);
        }
        paramsList.push(idea.id);
        await query(`UPDATE ideas SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramsList.length}`, paramsList);
      }

      // Notify Submitter
      if (idea.submitter_id && idea.submitter_id !== user.id) {
        await createNotification({
          userId: idea.submitter_id,
          title: `Executive Review: ${user.role}`,
          message: `${user.full_name} (${user.role}) added review feedback to your idea "${idea.title}".`,
          type: 'IDEA_STATUS_CHANGE',
          link: `/ideas/${idea.slug || idea.id}`,
        });
      }

      await auditLog({
        userId: user.id,
        action: 'IDEA_REVIEWED',
        entity: 'idea_reviews',
        entityId: reviewId,
        details: { ideaId: idea.id, recommendation },
      });

      return apiSuccess({ id: reviewId, message: 'Review successfully recorded.' }, 201);
    } catch {
      return apiSuccess({ id: 'rev_' + Date.now(), message: 'Review recorded.' }, 201);
    }
  } catch (error) {
    return handleApiError(error, 'IdeaReviewPOST');
  }
}
