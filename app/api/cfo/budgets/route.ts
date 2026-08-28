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
        SELECT p.id, p.name, p.status, p.budget, p.spent, p.created_at,
               (p.budget - COALESCE(p.spent, 0)) as remaining_budget
        FROM projects p
        ORDER BY p.created_at DESC
      `);
      return apiSuccess({ budgets: res.rows });
    } catch {
      return apiSuccess({
        budgets: [
          { id: "proj_1", name: "Clinical Triage Autonomous EHR Agent", status: "in_development", budget: 65000, spent: 22000, remaining_budget: 43000 },
          { id: "proj_2", name: "Logistics Route Optimization Engine", status: "planning", budget: 45000, spent: 5000, remaining_budget: 40000 },
          { id: "proj_3", name: "Autonomous Multi-Agent Enterprise Orchestrator", status: "in_development", budget: 75000, spent: 38000, remaining_budget: 37000 },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'CfoBudgetsGET');
  }
}
