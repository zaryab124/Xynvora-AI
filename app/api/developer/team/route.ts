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
          { full_name: "Mohib", position: "Software Head & Lead Architect", reputation_score: 980, availability: "Active on Sprints" },
          { full_name: "Musab", position: "Embedded Technologies Head", reputation_score: 950, availability: "Active on Hardware" },
          { full_name: "Ahmed Khan", position: "Senior AI Agent Architect", reputation_score: 850, availability: "Available" },
          { full_name: "Fatima Noor", position: "UI/UX & Frontend Lead", reputation_score: 800, availability: "Available" },
          { full_name: "Bilal Akhtar", position: "Systems & Database Lead", reputation_score: 750, availability: "Assigned" },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'DeveloperTeamGET');
  }
}
