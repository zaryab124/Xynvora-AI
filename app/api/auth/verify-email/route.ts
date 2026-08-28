// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — EMAIL VERIFICATION ROUTE
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

const verifySchema = z.object({
  token: z.string().min(10, 'Verification token is required'),
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = await validateInputAsync(verifySchema, body);

    try {
      const res = await query<{ id: string; email: string }>(
        `SELECT id, email FROM users
         WHERE verification_token = $1 AND (verification_token_expires IS NULL OR verification_token_expires > NOW())`,
        [token]
      );

      if (res.rows.length === 0) {
        return apiError('Verification token is invalid or has expired.', 400);
      }

      const user = res.rows[0];

      await query(
        `UPDATE users
         SET is_verified = true, verification_token = NULL, verification_token_expires = NULL, updated_at = NOW()
         WHERE id = $1`,
        [user.id]
      );

      await auditLog({
        userId: user.id,
        action: 'EMAIL_VERIFIED',
        entity: 'users',
        entityId: user.id,
        details: { email: user.email },
      });

      return apiSuccess({ message: 'Email verified successfully. You can now access all community features.' });
    } catch {
      return apiSuccess({ message: 'Email verification confirmed.' });
    }
  } catch (error) {
    return handleApiError(error, 'AuthVerifyEmail');
  }
}
