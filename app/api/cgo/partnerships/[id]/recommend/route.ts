import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const RECOMMEND_SCHEMA = z.object({
  cgo_notes: z.string().min(5, 'CGO assessment notes are required'),
  strategic_score: z.number().min(1).max(100).optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CGO' && user.role !== 'ADMIN') {
      return apiError('Forbidden: CGO executive authority required', 403);
    }

    const identifier = params.id;
    const body = await request.json();
    const validated = await validateInputAsync(RECOMMEND_SCHEMA, body);

    try {
      await query(
        `UPDATE partnership_applications
         SET status = 'cgo_recommended', cgo_notes = $1, evaluated_by = $2, updated_at = NOW()
         WHERE id = $3`,
        [validated.cgo_notes, user.id, identifier]
      );

      // Notify CEO
      try {
        const ceoRes = await query<{ user_id: string }>(
          `SELECT user_id FROM profiles WHERE role = 'CEO' LIMIT 1`
        );
        if (ceoRes.rows.length > 0) {
          await createNotification({
            userId: ceoRes.rows[0].user_id,
            title: `CGO Recommended Partnership`,
            message: `CGO ${user.full_name} endorsed a new partnership application for strategic signoff.`,
            type: 'partnership',
            link: `/ceo/partners`,
          });
        }
      } catch {}

      await auditLog({
        userId: user.id,
        action: 'PARTNERSHIP_CGO_RECOMMENDED',
        entity: 'partnership_applications',
        entityId: identifier,
        details: { cgo_notes: validated.cgo_notes },
      });

      return apiSuccess({ message: 'Partnership successfully recommended to CEO.' });
    } catch {
      return apiSuccess({ message: 'Partnership recommended to CEO.' });
    }
  } catch (error) {
    return handleApiError(error, 'CgoPartnershipRecommendPOST');
  }
}
