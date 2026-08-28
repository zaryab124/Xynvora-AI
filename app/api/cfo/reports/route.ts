import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CFO' && user.role !== 'ADMIN') {
      return apiError('Forbidden', 403);
    }

    return apiSuccess({
      financialReports: {
        quarterlyGrossMargin: "78.4%",
        monthlyRecurringRevenue: "$142,000",
        annualizedRunRate: "$1,704,000",
        blendedCAC: "$2,400",
        estimatedLTV: "$36,000",
        paybackPeriodMonths: 2.8,
        rAndDBurnRate: "$38,000 / mo",
        runwayMonths: 28,
        projections: [
          { quarter: "Q1 2026", revenue: 380000, expenses: 195000, ebitda: 185000 },
          { quarter: "Q2 2026", revenue: 520000, expenses: 240000, ebitda: 280000 },
          { quarter: "Q3 2026", revenue: 740000, expenses: 310000, ebitda: 430000 },
        ]
      }
    });
  } catch (error) {
    return handleApiError(error, 'CfoReportsGET');
  }
}
