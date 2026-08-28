// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — LOGOUT API ROUTE
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { auth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await auth(request.headers);

  if (user) {
    await auditLog({
      userId: user.id,
      action: 'USER_LOGOUT',
      entity: 'users',
      entityId: user.id,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });
  }

  const response = apiSuccess({ message: 'Logged out successfully.' });
  response.cookies.delete('xynvora_token');
  response.cookies.delete('sb-access-token');
  return response;
}
