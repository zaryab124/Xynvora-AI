import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CGO' && user.role !== 'ADMIN') {
      return apiError('Forbidden: Access restricted to CGO / Admin', 403);
    }

    return apiSuccess({
      growthMetrics: {
        monthlyActiveGrowth: "+38%",
        ideaIntakeVelocity: "14 ideas / week",
        validationCycleTime: "1.8 days average",
        ecosystemTraction: [
          { month: "Jan", submissions: 12, validated: 8 },
          { month: "Feb", submissions: 19, validated: 14 },
          { month: "Mar", submissions: 28, validated: 22 },
        ],
        industryBreakdown: [
          { domain: "Healthcare AI", count: 12, share: "37.5%" },
          { domain: "Supply Chain & Logistics", count: 9, share: "28.1%" },
          { domain: "Enterprise Automation", count: 7, share: "21.9%" },
          { domain: "Real Estate Tech", count: 4, share: "12.5%" },
        ]
      }
    });
  } catch (error) {
    return handleApiError(error, 'CgoGrowthGET');
  }
}
