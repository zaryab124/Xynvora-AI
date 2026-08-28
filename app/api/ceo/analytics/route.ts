import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CEO' && user.role !== 'ADMIN') {
      return apiError('Forbidden', 403);
    }

    return apiSuccess({
      analytics: {
        innovationThroughput: "8.4 ideas / sprint",
        cgoTriageEfficiency: "94.2%",
        cfoBudgetApprovalRate: "88%",
        sprintDeliveryVelocity: "96.5% on-time",
        ecosystemNPS: 78,
        activeEnterprisePilots: 3,
        pipelineValuation: "$2.4M projected enterprise impact",
      }
    });
  } catch (error) {
    return handleApiError(error, 'CeoAnalyticsGET');
  }
}
