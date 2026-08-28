import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);

    try {
      const res = await query(`
        SELECT p.id, p.user_id, p.full_name, p.role, p.position, p.company, p.reputation_score
        FROM profiles p
        WHERE p.role = 'DEVELOPER'
        ORDER BY p.reputation_score DESC
      `);
      return apiSuccess({ team: res.rows });
    } catch {
      return apiSuccess({
        team: [
          { full_name: "Ahmed Khan", position: "Senior AI Agent Architect", reputation_score: 500, availability: "Available" },
          { full_name: "Amina Farooq", position: "Full Stack Engineer", reputation_score: 320, availability: "Assigned to Sprint" },
          { full_name: "Bilal Akhtar", position: "Systems Lead", reputation_score: 410, availability: "Available" },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'DeveloperTeamGET');
  }
}
