// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — RESET PASSWORD API ROUTE
// ─────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

const resetSchema = z.object({
  token: z.string().min(10, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = await validateInputAsync(resetSchema, body);

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
      const res = await query<{ id: string }>(
        `SELECT id FROM users
         WHERE (reset_token = $1 OR reset_token = $2)
           AND reset_token_expires > NOW()
           AND is_active = true`,
        [hashedToken, token]
      );

      if (res.rows.length === 0) {
        return apiError('Password reset token is invalid or has expired.', 400);
      }

      const user = res.rows[0];
      const newHash = await bcrypt.hash(password, 12);

      await query(
        `UPDATE users
         SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW()
         WHERE id = $2`,
        [newHash, user.id]
      );

      await auditLog({
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETED',
        entity: 'users',
        entityId: user.id,
      });

      return apiSuccess({ message: 'Password has been reset successfully. Please log in.' });
    } catch {
      return apiSuccess({ message: 'Password reset processed.' });
    }
  } catch (error) {
    return handleApiError(error, 'AuthResetPassword');
  }
}
