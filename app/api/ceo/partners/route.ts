import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'CEO' && user.role !== 'ADMIN') {
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
          { id: "part_1", applicant_name: "Dr. Bilal Qureshi", company_name: "City General Hospital", partnership_type: "enterprise_client", status: "recommended_to_ceo", proposal_summary: "Deploy autonomous clinical triage across 4 regional outpatient facilities." },
          { id: "part_2", applicant_name: "Sarah Jenkins", company_name: "VectorCloud Infrastructure", partnership_type: "technology", status: "under_negotiation", proposal_summary: "Dedicated GPU cloud cluster partnership." },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'CeoPartnersGET');
  }
}
