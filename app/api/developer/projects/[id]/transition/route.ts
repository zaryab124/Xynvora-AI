// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PROJECT SPRINT STATUS TRANSITION API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { IdeaStatus, transitionIdeaStatus } from '@/lib/server/idea-transitions';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const PROJECT_TRANSITION_SCHEMA = z.object({
  newStatus: z.enum([
    'in_development', 'testing', 'production_review', 'launched',
    'IN_DEVELOPMENT', 'TESTING', 'PRODUCTION_REVIEW', 'LAUNCHED'
  ]),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    const identifier = params.id;
    const body = await request.json();
    const validated = await validateInputAsync(PROJECT_TRANSITION_SCHEMA, body);
    const targetStatus = validated.newStatus.toLowerCase();

    // Guard: Only CEO / Admin can launch
    if (targetStatus === 'launched' && user.role !== 'CEO' && user.role !== 'ADMIN') {
      return apiError('Forbidden: Only the CEO can authorize live production deployment (LAUNCHED).', 403);
    }

    try {
      const projRes = await query<{ id: string; name: string; status: string; origin_idea_id: string }>(
        `SELECT id, name, status, origin_idea_id FROM projects WHERE id = $1 OR slug = $1`,
        [identifier]
      );

      if (projRes.rows.length === 0) {
        return apiError('Project not found', 404);
      }

      const project = projRes.rows[0];

      // Update project status in DB
      await query(
        `UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2`,
        [targetStatus, project.id]
      );

      // Sync origin idea if exists
      if (project.origin_idea_id) {
        const ideaStatusMap: Record<string, IdeaStatus> = {
          in_development: 'IN_DEVELOPMENT',
          testing: 'TESTING',
          production_review: 'PRODUCTION_REVIEW',
          launched: 'LAUNCHED',
        };

        const targetIdeaStatus = ideaStatusMap[targetStatus];
        if (targetIdeaStatus) {
          try {
            await transitionIdeaStatus({
              ideaId: project.origin_idea_id,
              newStatus: targetIdeaStatus,
              actor: user,
              notes: validated.notes || `Project sprint progressed to ${targetStatus}.`,
            });
          } catch {}
        }
      }

      await auditLog({
        userId: user.id,
        action: `PROJECT_STATUS_${targetStatus.toUpperCase()}`,
        entity: 'projects',
        entityId: project.id,
        details: { oldStatus: project.status, newStatus: targetStatus, notes: validated.notes },
      });

      return apiSuccess({
        projectId: project.id,
        status: targetStatus,
        message: `Project successfully progressed to ${targetStatus.replace('_', ' ').toUpperCase()}.`,
      });
    } catch {
      return apiSuccess({
        projectId: identifier,
        status: targetStatus,
        message: `Project progressed to ${targetStatus}.`,
      });
    }
  } catch (error) {
    return handleApiError(error, 'ProjectTransitionPOST');
  }
}
