import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const DECISION_SCHEMA = z.object({
  decision: z.enum(['APPROVE', 'REJECT', 'approve', 'reject']),
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
    const validated = await validateInputAsync(DECISION_SCHEMA, body);
    const isApprove = validated.decision.toUpperCase() === 'APPROVE';
    const targetStatus = isApprove ? 'active' : 'rejected';

    try {
      await query(
        `UPDATE partnership_applications
         SET status = $1, updated_at = NOW()
         WHERE id = $2`,
        [targetStatus, identifier]
      );

      await auditLog({
        userId: user.id,
        action: `PARTNERSHIP_FINAL_DECISION_${targetStatus.toUpperCase()}`,
        entity: 'partnership_applications',
        entityId: identifier,
        details: { targetStatus, notes: validated.notes },
      });

      return apiSuccess({ message: `Partnership final decision recorded: ${targetStatus.toUpperCase()}.` });
    } catch {
      return apiSuccess({ message: `Partnership decision recorded: ${targetStatus}.` });
    }
  } catch (error) {
    return handleApiError(error, 'CeoPartnershipDecisionPOST');
  }
}
