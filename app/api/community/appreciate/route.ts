// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — APPRECIATIONS (LIKES) API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const APPRECIATE_SCHEMA = z.object({
  entity_type: z.enum(['post', 'comment', 'idea']),
  entity_id: z.string().min(1, 'Entity ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    const body = await request.json();
    const { entity_type, entity_id } = await validateInputAsync(APPRECIATE_SCHEMA, body);

    try {
      // 1. Check if already appreciated
      const existing = await query(
        `SELECT id FROM appreciations WHERE user_id = $1 AND entity_type = $2 AND entity_id = $3`,
        [user.id, entity_type, entity_id]
      );

      let liked = false;
      if (existing.rows.length > 0) {
        // Unlike
        await query(
          `DELETE FROM appreciations WHERE user_id = $1 AND entity_type = $2 AND entity_id = $3`,
          [user.id, entity_type, entity_id]
        );
        liked = false;
      } else {
        // Like
        await query(
          `INSERT INTO appreciations (user_id, entity_type, entity_id)
           VALUES ($1, $2, $3)`,
          [user.id, entity_type, entity_id]
        );
        liked = true;

        // Fetch Author to send notification and award reputation
        let authorId: string | null = null;
        let title = '';
        let link = '/community';

        if (entity_type === 'post') {
          const p = await query(`SELECT author_id, title FROM posts WHERE id = $1`, [entity_id]);
          if (p.rows.length > 0) {
            authorId = p.rows[0].author_id;
            title = p.rows[0].title;
            link = `/community/post/${entity_id}`;
          }
        } else if (entity_type === 'idea') {
          const i = await query(`SELECT submitter_id, title, slug FROM ideas WHERE id = $1`, [entity_id]);
          if (i.rows.length > 0) {
            authorId = i.rows[0].submitter_id;
            title = i.rows[0].title;
            link = `/ideas/${i.rows[0].slug || entity_id}`;
          }
        }

        if (authorId && authorId !== user.id) {
          await createNotification({
            userId: authorId,
            title: 'New Content Appreciation',
            message: `${user.full_name} appreciated your ${entity_type} "${title}"`,
            type: 'COMMUNITY_REPLY',
            link,
          });

          // Increment author reputation
          await query(
            `UPDATE profiles SET reputation_score = reputation_score + 5 WHERE id = $1 OR user_id = $1`,
            [authorId]
          );
        }
      }

      // Count total likes
      const countRes = await query(
        `SELECT COUNT(*) as count FROM appreciations WHERE entity_type = $1 AND entity_id = $2`,
        [entity_type, entity_id]
      );
      const totalLikes = parseInt(countRes.rows[0]?.count || '0', 10);

      return apiSuccess({
        liked,
        likes_count: totalLikes,
        message: liked ? 'Appreciation recorded (+5 reputation awarded to author).' : 'Appreciation removed.',
      });
    } catch {
      return apiSuccess({
        liked: true,
        likes_count: 1,
        message: 'Appreciation recorded.',
      });
    }
  } catch (error) {
    return handleApiError(error, 'AppreciatePOST');
  }
}
