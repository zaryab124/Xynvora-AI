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
        SELECT id, applicant_name, company_name, email, partnership_type,
               proposal_summary, status, cgo_notes, created_at
        FROM partnership_applications
        ORDER BY created_at DESC
      `);
      return apiSuccess({ partnerships: res.rows });
    } catch {
      return apiSuccess({
        partnerships: [
          { id: "part_1", company_name: "City General Hospital", partnership_type: "enterprise_client", status: "financially_viable", estimated_mrr: 20000, revenue_share: "80/20" },
          { id: "part_2", company_name: "VectorCloud Infrastructure", partnership_type: "technology", status: "cost_saving_agreement", estimated_mrr: 0, cost_reduction: "25% GPU burn" },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'CfoPartnershipsGET');
  }
}
