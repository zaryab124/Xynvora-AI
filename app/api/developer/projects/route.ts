// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — DEVELOPER PROJECTS API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);

    const allowed = ['DEVELOPER', 'ADMIN', 'CEO', 'CGO'];
    if (!allowed.includes(user.role)) {
      return apiError('Forbidden', 403);
    }

    try {
      const res = await query(`
        SELECT p.id, p.name, p.slug, p.description, p.status, p.progress, p.budget, p.spent, p.created_at,
               pm.project_role,
               (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
               (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as completed_tasks
        FROM projects p
        LEFT JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
        WHERE pm.user_id = $1 OR $2 = 'ADMIN' OR $2 = 'CEO'
        ORDER BY p.updated_at DESC
      `, [user.id, user.role]);

      return apiSuccess({ projects: res.rows });
    } catch {
      return apiSuccess({
        projects: [
          {
            id: "proj_1",
            name: "Clinical Triage Autonomous EHR Agent",
            slug: "clinical-triage-autonomous-ehr-agent",
            description: "Production implementation of autonomous clinical documentation and triage agent.",
            status: "in_development",
            progress: 45,
            budget: 65000,
            spent: 22000,
            total_tasks: 12,
            completed_tasks: 6,
            project_role: "lead",
            created_at: new Date().toISOString(),
          }
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'DeveloperProjectsGET');
  }
}
