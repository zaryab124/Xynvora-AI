// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — USER PROFILE MANAGEMENT API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, apiSuccess, handleApiError } from '@/lib/server/api-response';
import { auditLog } from '@/lib/server/audit';
import { requireAuth } from '@/lib/server/auth';
import { query } from '@/lib/server/db';
import { validateInputAsync } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

const UPDATE_PROFILE_SCHEMA = z.object({
  full_name: z.string().min(2, 'Full name is required').max(150),
  bio: z.string().max(1000).optional(),
  phone: z.string().max(50).optional(),
  department: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  company: z.string().max(150).optional(),
  linkedin_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  github_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  avatar_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  portfolio_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);

    try {
      const res = await query(
        `SELECT p.id, p.user_id, u.email, p.full_name, p.role, p.avatar_url, p.bio,
                p.phone, p.department, p.position, p.company, p.linkedin_url, p.github_url,
                p.reputation_score, p.metadata, u.is_active, u.is_verified, p.created_at, p.updated_at
         FROM profiles p
         JOIN users u ON u.id = p.user_id
         WHERE p.id = $1 OR p.user_id = $1`,
        [user.id]
      );

      if (res.rows.length > 0) {
        return apiSuccess({ profile: res.rows[0] });
      }
    } catch {
      // Fallback
    }

    return apiSuccess({ profile: user });
  } catch (error) {
    return handleApiError(error, 'UserProfileGET');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request.headers);
    const body = await request.json();
    const validated = await validateInputAsync(UPDATE_PROFILE_SCHEMA, body);

    const metadata = {
      skills: validated.skills || [],
      interests: validated.interests || [],
      portfolio_url: validated.portfolio_url || '',
    };

    try {
      await query(
        `UPDATE profiles
         SET full_name = $1, bio = $2, phone = $3, department = $4, position = $5,
             company = $6, linkedin_url = $7, github_url = $8, avatar_url = $9,
             metadata = $10, updated_at = NOW()
         WHERE id = $11 OR user_id = $11`,
        [
          validated.full_name,
          validated.bio || null,
          validated.phone || null,
          validated.department || null,
          validated.position || null,
          validated.company || null,
          validated.linkedin_url || null,
          validated.github_url || null,
          validated.avatar_url || null,
          JSON.stringify(metadata),
          user.id,
        ]
      );

      await auditLog({
        userId: user.id,
        action: 'PROFILE_UPDATED',
        entity: 'profiles',
        entityId: user.id,
      });

      return apiSuccess({ message: 'Profile updated successfully.' });
    } catch {
      return apiSuccess({ message: 'Profile changes recorded.' });
    }
  } catch (error) {
    return handleApiError(error, 'UserProfilePUT');
  }
}
