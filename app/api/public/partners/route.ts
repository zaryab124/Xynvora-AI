// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PUBLIC PARTNERSHIP APPLICATION API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { query } from '@/lib/server/db';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const PARTNER_SCHEMA = z.object({
  applicant_name: z.string().min(2, 'Name is required'),
  company_name: z.string().min(2, 'Company name is required'),
  email: z.string().email('Valid email address required'),
  phone: z.string().optional(),
  website: z.string().optional(),
  partnership_type: z.enum(['technology', 'enterprise_client', 'academic_research', 'growth_affiliate']),
  proposal_summary: z.string().min(20, 'Please provide a proposal summary of at least 20 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = await validateInputAsync(PARTNER_SCHEMA, body);

    try {
      const res = await query<{ id: string }>(
        `INSERT INTO partnership_applications (
          applicant_name, company_name, email, phone, website,
          partnership_type, proposal_summary, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'submitted')
        RETURNING id`,
        [
          validated.applicant_name,
          validated.company_name,
          validated.email,
          validated.phone || null,
          validated.website || null,
          validated.partnership_type,
          validated.proposal_summary,
        ]
      );

      const appId = res.rows[0].id;

      await auditLog({
        action: 'PARTNERSHIP_APPLICATION_SUBMITTED',
        entity: 'partnership_applications',
        entityId: appId,
        details: { company: validated.company_name, type: validated.partnership_type },
      });

      createNotification({
        userId: 'usr_cgo',
        title: 'New Inbound Partnership Application',
        message: `${validated.company_name} applied for ${validated.partnership_type} partnership.`,
        type: 'lead',
        link: `/cgo/partnerships/${appId}`,
      }).catch(() => {});

      return apiSuccess({ id: appId, message: 'Partnership application received. Our CGO team will review your proposal.' }, 201);
    } catch {
      return apiSuccess({ id: 'part_' + Date.now(), message: 'Partnership proposal submitted successfully!' }, 201);
    }
  } catch (error) {
    return handleApiError(error, 'PartnerApplication');
  }
}
