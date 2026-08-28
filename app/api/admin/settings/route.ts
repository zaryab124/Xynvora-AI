import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'ADMIN') return apiError('Forbidden', 403);

    return apiSuccess({
      settings: {
        platformName: "Xynvora AI Platform",
        version: "1.4.0-prod",
        maintenanceMode: false,
        allowNewRegistrations: true,
        enforceEmailVerification: true,
        maxUploadSizeBytes: 25 * 1024 * 1024, // 25 MB
        logLevel: "info",
        securityHeaders: {
          cspEnabled: true,
          hstsEnabled: true,
          xFrameOptions: "DENY",
        }
      }
    });
  } catch (error) {
    return handleApiError(error, 'AdminSettingsGET');
  }
}
