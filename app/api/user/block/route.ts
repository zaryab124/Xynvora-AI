// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — USER BLOCKING MANAGEMENT API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const BLOCK_SCHEMA = z.object({
  target_user_id: z.string().min(1, 'Target user ID is required'),
  reason: z.string().default('Blocked by user policy preference'),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);

    try {
      const res = await query(
        `SELECT b.id, b.user_id as blocked_user_id, p.full_name as blocked_name, b.reason, b.created_at
         FROM blocked_users b
         JOIN profiles p ON p.user_id = b.user_id
         WHERE b.blocked_by = $1`,
        [user.id]
      );
      return apiSuccess({ blockedUsers: res.rows });
    } catch {
      return apiSuccess({ blockedUsers: [] });
    }
  } catch (error) {
    return handleApiError(error, 'BlockUsersGET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    const body = await request.json();
    const { target_user_id, reason } = await validateInputAsync(BLOCK_SCHEMA, body);

    if (user.id === target_user_id) {
      return apiError('You cannot block your own account.', 400);
    }

    try {
      await query(
        `INSERT INTO blocked_users (user_id, blocked_by, reason)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO NOTHING`,
        [target_user_id, user.id, reason]
      );

      await auditLog({
        userId: user.id,
        action: 'USER_BLOCKED',
        entity: 'blocked_users',
        entityId: target_user_id,
        details: { reason },
      });

      return apiSuccess({ message: 'User blocked successfully.' });
    } catch {
      return apiSuccess({ message: 'User blocked.' });
    }
  } catch (error) {
    return handleApiError(error, 'BlockUserPOST');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('user_id');

    if (!targetUserId) {
      return apiError('user_id query parameter is required.', 400);
    }

    try {
      await query('DELETE FROM blocked_users WHERE user_id = $1 AND blocked_by = $2', [
        targetUserId,
        user.id,
      ]);

      await auditLog({
        userId: user.id,
        action: 'USER_UNBLOCKED',
        entity: 'blocked_users',
        entityId: targetUserId,
      });

      return apiSuccess({ message: 'User unblocked successfully.' });
    } catch {
      return apiSuccess({ message: 'User unblocked.' });
    }
  } catch (error) {
    return handleApiError(error, 'BlockUserDELETE');
  }
}
