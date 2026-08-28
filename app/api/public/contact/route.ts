// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PUBLIC CONTACT & INQUIRY API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { createNotification } from '@/lib/server/notifications';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const CONTACT_SCHEMA = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email address required'),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = await validateInputAsync(CONTACT_SCHEMA, body);

    await auditLog({
      action: 'PUBLIC_CONTACT_SUBMISSION',
      entity: 'inquiries',
      details: { email: validated.email, service: validated.service, company: validated.company },
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    createNotification({
      userId: 'usr_cgo',
      title: 'New Client Inquiry',
      message: `Inquiry from ${validated.name} (${validated.email}) for ${validated.service || 'General Inquiry'}.`,
      type: 'lead',
    }).catch(() => {});

    return apiSuccess({
      message: 'Thank you for reaching out! A Xynvora AI specialist will contact you within 24 hours.',
    });
  } catch (error) {
    return handleApiError(error, 'ContactSubmission');
  }
}
