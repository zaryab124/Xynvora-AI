import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (!['DEVELOPER', 'CEO', 'ADMIN'].includes(user.role)) {
      return apiError('Forbidden: Developer clearance required.', 403);
    }

    return apiSuccess({
      analytics: {
        tasks: {
          total_assigned: 18,
          in_progress: 7,
          in_review: 4,
          completed: 26,
        },
        workload: {
          sprint_capacity: "82%",
          active_engineers: 8,
          average_cycle_time_days: "3.4",
        },
        milestones: {
          upcoming_milestones: 4,
          completed_milestones: 12,
          on_time_delivery_rate: "96.2%",
        },
        project_progress: {
          average_progress_pct: 68,
          active_projects: 3,
        }
      }
    });
  } catch (error) {
    return handleApiError(error, 'DeveloperAnalyticsGET');
  }
}
