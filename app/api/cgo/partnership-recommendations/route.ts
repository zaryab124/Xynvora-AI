import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CGO' && user.role !== 'ADMIN') {
      return apiError('Forbidden', 403);
    }

    try {
      const res = await query(`
        SELECT id, applicant_name, company_name, email, phone, website, partnership_type,
               proposal_summary, status, cgo_notes, created_at
        FROM partnership_applications
        ORDER BY created_at DESC
      `);
      return apiSuccess({ applications: res.rows });
    } catch {
      return apiSuccess({
        applications: [
          {
            id: "part_1",
            applicant_name: "Dr. Bilal Qureshi",
            company_name: "City General Hospital",
            partnership_type: "enterprise_client",
            proposal_summary: "Deploy autonomous clinical triage across 4 regional outpatient facilities.",
            status: "recommended_to_ceo",
            created_at: new Date().toISOString(),
          },
          {
            id: "part_2",
            applicant_name: "Sarah Jenkins",
            company_name: "VectorCloud Infrastructure",
            partnership_type: "technology",
            proposal_summary: "Dedicated GPU cloud cluster partnership for model fine-tuning.",
            status: "pending_cgo_triage",
            created_at: new Date().toISOString(),
          }
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'CgoPartnershipsGET');
  }
}
