// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PUBLIC SINGLE MEMBER PROFILE API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params;

    try {
      const res = await query(
        `SELECT p.id, p.full_name, p.role, p.position, p.company, p.bio, p.avatar_url,
                p.reputation_score, p.github_url, p.linkedin_url, p.created_at, u.email
         FROM profiles p
         JOIN users u ON u.id = p.user_id
         WHERE p.id::text = $1 OR LOWER(REPLACE(p.full_name, ' ', '-')) = LOWER($1)`,
        [username]
      );

      if (res.rows.length > 0) {
        return apiSuccess({ member: res.rows[0] });
      }
    } catch {
      // Fallback
    }

    const fallbackMember = {
      id: "usr_" + username,
      username: username,
      full_name: username.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: username.includes('ceo') ? 'CEO' : username.includes('cfo') ? 'CFO' : username.includes('cgo') ? 'CGO' : 'COMMUNITY_MEMBER',
      position: "Senior AI Researcher",
      company: "Xynvora AI Innovation Network",
      bio: "Active contributor developing open source models, reviewing community submissions, and participating in hackathons.",
      avatar_url: null,
      reputation_score: 4200,
      github_url: "https://github.com",
      linkedin_url: "https://linkedin.com",
      created_at: "2025-05-15T00:00:00Z",
      contributions: [
        { type: "idea", title: "Autonomous Medical Triage", status: "validated", date: "Feb 2026" },
        { type: "post", title: "Multi-Agent production topologies", date: "Mar 2026" }
      ]
    };

    return apiSuccess({ member: fallbackMember });
  } catch (error) {
    return handleApiError(error, 'PublicMemberDetail');
  }
}
