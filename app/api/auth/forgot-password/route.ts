// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — FORGOT PASSWORD API ROUTE
// ─────────────────────────────────────────────────────────────

import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

const forgotSchema = z.object({
  email: z.string().email('Valid email address required').toLowerCase().trim(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = await validateInputAsync(forgotSchema, body);

    try {
      const res = await query<{ id: string }>(
        'SELECT id FROM users WHERE email = $1 AND is_active = true',
        [email]
      );

      if (res.rows.length > 0) {
        const user = res.rows[0];
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        await query(
          'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
          [hashedToken, expiresAt, user.id]
        );

        await auditLog({
          userId: user.id,
          action: 'PASSWORD_RESET_REQUESTED',
          entity: 'users',
          entityId: user.id,
          details: { email },
        });
      }
    } catch {
      // Always return 200 for security to prevent user enumeration
    }

    return apiSuccess({
      message: 'If the provided email is registered, password reset instructions have been sent.',
    });
  } catch (error) {
    return handleApiError(error, 'AuthForgotPassword');
  }
}
