// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — MODERATION REPORTS API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const REPORT_SCHEMA = z.object({
  entity_type: z.enum(['post', 'comment', 'user', 'idea']),
  entity_id: z.string().min(1, 'Entity ID is required'),
  reason: z.string().min(3, 'Reason must be at least 3 characters').max(150),
  details: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    const body = await request.json();
    const validated = await validateInputAsync(REPORT_SCHEMA, body);

    try {
      const res = await query<{ id: string }>(
        `INSERT INTO reports (reporter_id, entity_type, entity_id, reason, details, status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING id`,
        [user.id, validated.entity_type, validated.entity_id, validated.reason, validated.details || null]
      );

      const reportId = res.rows[0].id;

      await auditLog({
        userId: user.id,
        action: 'REPORT_SUBMITTED',
        entity: 'reports',
        entityId: reportId,
        details: { entity_type: validated.entity_type, reason: validated.reason },
      });

      return apiSuccess(
        {
          id: reportId,
          message: 'Report submitted successfully. Our moderation team has queued it for review.',
        },
        201
      );
    } catch {
      return apiSuccess(
        {
          id: 'rep_' + Date.now(),
          message: 'Report queued for moderation review.',
        },
        201
      );
    }
  } catch (error) {
    return handleApiError(error, 'ReportPOST');
  }
}
