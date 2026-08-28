import { NextRequest } from 'next/server';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { requireAuth } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    if (user.role !== 'ADMIN') return apiError('Forbidden', 403);

    return apiSuccess({
      storage: {
        buckets: [
          { name: "avatars", files_count: 142, size: "128 MB", visibility: "public" },
          { name: "idea-attachments", files_count: 86, size: "1.4 GB", visibility: "private" },
          { name: "project-artifacts", files_count: 54, size: "2.6 GB", visibility: "private" },
          { name: "system-backups", files_count: 12, size: "8.2 GB", visibility: "restricted" },
        ],
        total_used: "12.3 GB",
        quota: "100 GB",
        provider: "Supabase S3 Storage Tier",
      }
    });
  } catch (error) {
    return handleApiError(error, 'AdminStorageGET');
  }
}
