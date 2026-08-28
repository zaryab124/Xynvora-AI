// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — IDEA STATUS TRANSITION API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { IdeaStatus, transitionIdeaStatus } from '@/lib/server/idea-transitions';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const TRANSITION_SCHEMA = z.object({
  newStatus: z.string().min(2, 'newStatus is required'),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request.headers);
    const identifier = params.id;
    const body = await request.json();
    const validated = await validateInputAsync(TRANSITION_SCHEMA, body);

    const result = await transitionIdeaStatus({
      ideaId: identifier,
      newStatus: validated.newStatus as IdeaStatus,
      actor: user,
      notes: validated.notes,
      metadata: validated.metadata,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error, 'IdeaTransitionPOST');
  }
}
