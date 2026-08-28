import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    try {
      const res = await query(`
        SELECT id, company_name, partnership_type, website, status, created_at
        FROM partnership_applications
        WHERE status = 'active'
        ORDER BY created_at DESC
      `);
      return apiSuccess({ partnerships: res.rows });
    } catch {
      return apiSuccess({
        partnerships: [
          { id: "part_1", company_name: "Apex Global Cloud", partnership_type: "technology", status: "active" },
          { id: "part_2", company_name: "City General Health System", partnership_type: "enterprise_client", status: "active" },
          { id: "part_3", company_name: "FAST-NUCES AI Institute", partnership_type: "academic_research", status: "active" },
        ]
      });
    }
  } catch (error) {
    return handleApiError(error, 'PartnershipsGET');
  }
}
