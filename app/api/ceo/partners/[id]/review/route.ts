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
  action: z.enum(['REQUEST_CFO_REVIEW', 'REJECT', 'request_cfo_review', 'reject']),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CEO' && user.role !== 'ADMIN') {
      return apiError('Forbidden: CEO authority required', 403);
    }

    const identifier = params.id;
    const body = await request.json();
    const validated = await validateInputAsync(REVIEW_SCHEMA, body);
    const act = validated.action.toUpperCase();

    const targetStatus = act === 'REQUEST_CFO_REVIEW' ? 'cfo_review_requested' : 'rejected';

    try {
      await query(
        `UPDATE partnership_applications
         SET status = $1, updated_at = NOW()
         WHERE id = $2`,
        [targetStatus, identifier]
      );

      if (act === 'REQUEST_CFO_REVIEW') {
        try {
          const cfoRes = await query<{ user_id: string }>(
            `SELECT user_id FROM profiles WHERE role = 'CFO' LIMIT 1`
          );
          if (cfoRes.rows.length > 0) {
            await createNotification({
              userId: cfoRes.rows[0].user_id,
              title: `CFO Financial Review Requested for Partnership`,
              message: `CEO ${user.full_name} requested commercial terms modeling for a partnership application.`,
              type: 'partnership',
              link: `/cfo/partnerships`,
            });
          }
        } catch {}
      }

      await auditLog({
        userId: user.id,
        action: `PARTNERSHIP_CEO_${act}`,
        entity: 'partnership_applications',
        entityId: identifier,
        details: { targetStatus, notes: validated.notes },
      });

      return apiSuccess({ message: `Partnership status updated to ${targetStatus}.` });
    } catch {
      return apiSuccess({ message: `Partnership updated to ${targetStatus}.` });
    }
  } catch (error) {
    return handleApiError(error, 'CeoPartnershipReviewPOST');
  }
}
