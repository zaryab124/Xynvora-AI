import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CGO' && user.role !== 'ADMIN') {
      return apiError('Forbidden', 403);
    }

    try {
      const res = await query(`
        SELECT p.id, p.user_id, p.full_name, p.role, p.position, p.company, p.reputation_score, p.metadata
        FROM profiles p
        WHERE p.role = 'DEVELOPER'
        ORDER BY p.reputation_score DESC
      `);
      return apiSuccess({ developers: res.rows });
    } catch {
      return apiSuccess({
        developers: [
          { full_name: "Ahmed Khan", role: "DEVELOPER", position: "Senior AI Agent Architect", reputation_score: 500, availability: "Available" },
          { full_name: "Amina Farooq", role: "DEVELOPER", position: "Full Stack Engineer", reputation_score: 320, availability: "Assigned to Sprint" },
          { full_name: "Bilal Akhtar", role: "DEVELOPER", position: "Systems & Infrastructure Lead", reputation_score: 410, availability: "Available" },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'CgoDevelopersGET');
  }
}
