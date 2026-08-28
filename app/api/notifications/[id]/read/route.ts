// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — MARK SINGLE NOTIFICATION READ API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    const notifId = params.id;

    try {
      await query(
        `UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1 AND user_id = $2`,
        [notifId, user.id]
      );
      return apiSuccess({ message: 'Notification marked as read.' });
    } catch {
      return apiSuccess({ message: 'Notification updated.' });
    }
  } catch (error) {
    return handleApiError(error, 'NotificationMarkRead');
  }
}
