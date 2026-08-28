import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (!['CFO', 'ADMIN'].includes(user.role)) {
      return apiError('Forbidden: CFO clearance required.', 403);
    }

    return apiSuccess({
      analytics: {
        budgets: {
          total_allocated_capital: "$120,000",
          disbursed_to_sprints: "$74,500",
          contingency_reserve: "$45,500",
          burn_rate_monthly: "$18,500",
        },
        costs: {
          gpu_compute_infrastructure: "$8,200",
          developer_compensation: "$12,400",
          operational_overhead: "$2,100",
        },
        revenue_opportunities: {
          projected_arr: "$340,000",
          enterprise_pilot_pipeline: "$185,000",
          target_payback_period: "8.4 months",
        },
        financial_risk: {
          portfolio_risk_level: "LOW",
          cfo_evaluations_completed: 14,
          unit_economics_positive_rate: "91.6%",
        }
      }
    });
  } catch (error) {
    return handleApiError(error, 'CfoAnalyticsGET');
  }
}
