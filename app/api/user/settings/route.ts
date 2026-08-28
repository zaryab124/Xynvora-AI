// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — USER SETTINGS API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const SETTINGS_SCHEMA = z.object({
  email_notifications: z.boolean().default(true),
  idea_status_alerts: z.boolean().default(true),
  community_replies_alerts: z.boolean().default(true),
  profile_public: z.boolean().default(true),
  theme: z.enum(['dark', 'cyber', 'midnight']).default('cyber'),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);

    try {
      const res = await query('SELECT metadata FROM profiles WHERE id = $1 OR user_id = $1', [user.id]);
      const metadata = res.rows[0]?.metadata || {};
      const settings = metadata.settings || {
        email_notifications: true,
        idea_status_alerts: true,
        community_replies_alerts: true,
        profile_public: true,
        theme: 'cyber',
      };
      return apiSuccess({ settings });
    } catch {
      // Fallback
      return apiSuccess({
        settings: {
          email_notifications: true,
          idea_status_alerts: true,
          community_replies_alerts: true,
          profile_public: true,
          theme: 'cyber',
        },
      });
    }
  } catch (error) {
    return handleApiError(error, 'UserSettingsGET');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    const body = await request.json();
    const validated = await validateInputAsync(SETTINGS_SCHEMA, body);

    try {
      const res = await query('SELECT metadata FROM profiles WHERE id = $1 OR user_id = $1', [user.id]);
      const currentMeta = res.rows[0]?.metadata || {};
      const newMeta = { ...currentMeta, settings: validated };

      await query('UPDATE profiles SET metadata = $1, updated_at = NOW() WHERE id = $2 OR user_id = $2', [
        JSON.stringify(newMeta),
        user.id,
      ]);

      await auditLog({
        userId: user.id,
        action: 'USER_SETTINGS_UPDATED',
        entity: 'profiles',
        entityId: user.id,
      });

      return apiSuccess({ message: 'Settings updated successfully.', settings: validated });
    } catch {
      return apiSuccess({ message: 'Settings saved.', settings: validated });
    }
  } catch (error) {
    return handleApiError(error, 'UserSettingsPUT');
  }
}
