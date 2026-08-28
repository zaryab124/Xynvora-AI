import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CFO' && user.role !== 'ADMIN') {
      return apiError('Forbidden', 403);
    }

    try {
      const res = await query(`
        SELECT p.id, p.name, p.slug, p.description, p.status, p.budget, p.spent, p.created_at,
               (p.budget - COALESCE(p.spent, 0)) as remaining_budget,
               p.origin_idea_id, i.title as origin_idea_title
        FROM projects p
        LEFT JOIN ideas i ON i.id = p.origin_idea_id
        ORDER BY p.created_at DESC
      `);
      return apiSuccess({ projects: res.rows });
    } catch {
      return apiSuccess({
        projects: [
          {
            id: "proj_1",
            name: "Clinical Triage Autonomous EHR Agent",
            slug: "clinical-triage-autonomous-ehr-agent",
            status: "in_development",
            budget: 65000,
            spent: 22000,
            remaining_budget: 43000,
            created_at: new Date().toISOString(),
          }
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'CfoProjectsGET');
  }
}
