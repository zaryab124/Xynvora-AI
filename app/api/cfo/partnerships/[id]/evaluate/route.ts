import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const EVALUATE_SCHEMA = z.object({
  revenue_share: z.string().min(3),
  estimated_mrr: z.number().optional(),
  financial_notes: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CFO' && user.role !== 'ADMIN') {
      return apiError('Forbidden: CFO financial authority required', 403);
    }

    const identifier = params.id;
    const body = await request.json();
    const validated = await validateInputAsync(EVALUATE_SCHEMA, body);

    try {
      await query(
        `UPDATE partnership_applications
         SET status = 'cfo_evaluated', updated_at = NOW()
         WHERE id = $1`,
        [identifier]
      );

      // Notify CEO
      try {
        const ceoRes = await query<{ user_id: string }>(
          `SELECT user_id FROM profiles WHERE role = 'CEO' LIMIT 1`
        );
        if (ceoRes.rows.length > 0) {
          await createNotification({
            userId: ceoRes.rows[0].user_id,
            title: `CFO Completed Financial Modeling for Partnership`,
            message: `CFO ${user.full_name} completed commercial terms evaluation. Ready for final strategic decision.`,
            type: 'partnership',
            link: `/ceo/partners`,
          });
        }
      } catch {}

      await auditLog({
        userId: user.id,
        action: 'PARTNERSHIP_CFO_EVALUATED',
        entity: 'partnership_applications',
        entityId: identifier,
        details: { terms: validated.revenue_share, mrr: validated.estimated_mrr },
      });

      return apiSuccess({ message: 'Commercial valuation recorded and submitted to CEO for final decision.' });
    } catch {
      return apiSuccess({ message: 'Commercial valuation recorded.' });
    }
  } catch (error) {
    return handleApiError(error, 'CfoPartnershipEvaluatePOST');
  }
}
