// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — AUTHENTICATED USER INTROSPECTION
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    return apiSuccess({ user });
  } catch (error) {
    return handleApiError(error, 'AuthMe');
  }
}
