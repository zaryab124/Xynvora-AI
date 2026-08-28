// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PUBLIC MEMBERS DIRECTORY API
// ─────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { apiSuccess, handleApiError } from '@/lib/server/api-response';
import { query } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

const DEFAULT_MEMBERS = [
  {
    id: "usr_ceo",
    username: "zain-ul-abideen",
    full_name: "Zain ul Abideen",
    role: "CEO",
    position: "Chief Executive Officer",
    company: "Xynvora AI",
    bio: "Driving the strategic vision of autonomous AI systems and global digital transformation.",
    avatar_url: "/images/ceo xynvoraai.jpeg",
    reputation_score: 9500,
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "usr_cfo",
    username: "sara-malik",
    full_name: "Sara Malik",
    role: "CFO",
    position: "Chief Financial Officer",
    company: "Xynvora AI",
    bio: "Financial engineering, risk mitigation, and scaling operational capital efficiency.",
    avatar_url: "/images/cfo.jpg",
    reputation_score: 8700,
    github_url: null,
    linkedin_url: "https://linkedin.com",
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "usr_cgo",
    username: "hassan-raza",
    full_name: "Hassan Raza",
    role: "CGO",
    position: "Chief Growth Officer",
    company: "Xynvora AI",
    bio: "Empowering global community innovators and translating breakthrough ideas into scalable products.",
    avatar_url: "/images/cgo.jpg",
    reputation_score: 9100,
    github_url: null,
    linkedin_url: "https://linkedin.com",
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "usr_ahmed",
    username: "ahmed-khan",
    full_name: "Ahmed Khan",
    role: "DEVELOPER",
    position: "Lead AI Engineer",
    company: "Xynvora AI",
    bio: "Specializing in Large Language Model fine-tuning, multi-agent frameworks, and low-latency inference.",
    avatar_url: null,
    reputation_score: 3400,
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    created_at: "2025-02-10T00:00:00Z"
  },
  {
    id: "usr_fatima",
    username: "fatima-noor",
    full_name: "Fatima Noor",
    role: "DEVELOPER",
    position: "Frontend Architect",
    company: "Xynvora AI",
    bio: "Building cutting-edge React, Next.js, and Three.js cyberpunk interactive interfaces.",
    avatar_url: null,
    reputation_score: 2900,
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    created_at: "2025-03-01T00:00:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    try {
      let queryStr = `
        SELECT p.id, p.full_name, p.role, p.position, p.company, p.bio, p.avatar_url,
               p.reputation_score, p.github_url, p.linkedin_url, p.created_at, u.email
        FROM profiles p
        JOIN users u ON u.id = p.user_id
        WHERE u.is_active = true
      `;
      const params: unknown[] = [];

      if (role && role !== 'All') {
        params.push(role);
        queryStr += ` AND p.role::text = $${params.length}`;
      }

      queryStr += ' ORDER BY p.reputation_score DESC LIMIT 50';

      const res = await query(queryStr, params);
      if (res.rows.length > 0) {
        return apiSuccess({ members: res.rows });
      }
    } catch {
      // Fallback
    }

    let filtered = [...DEFAULT_MEMBERS];
    if (role && role !== 'All') {
      filtered = filtered.filter((m) => m.role.toLowerCase() === role.toLowerCase());
    }

    return apiSuccess({ members: filtered });
  } catch (error) {
    return handleApiError(error, 'PublicMembers');
  }
}
