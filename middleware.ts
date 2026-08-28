// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — EDGE ROUTE PROTECTION MIDDLEWARE
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TokenPayload {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function normalizeRole(role?: string): string {
  if (!role) return 'VISITOR';
  const upper = role.toUpperCase();
  const map: Record<string, string> = {
    SUPER_ADMIN: 'ADMIN',
    ADMIN: 'ADMIN',
    CGO: 'CGO',
    CEO: 'CEO',
    CFO: 'CFO',
    DEVELOPER: 'DEVELOPER',
    EMPLOYEE: 'DEVELOPER',
    MANAGER: 'CGO',
    MEMBER: 'COMMUNITY_MEMBER',
    CLIENT: 'COMMUNITY_MEMBER',
    COMMUNITY_MODERATOR: 'COMMUNITY_MODERATOR',
    COMMUNITY_MEMBER: 'COMMUNITY_MEMBER',
  };
  return map[upper] || upper;
}

const PROTECTED_ROUTES: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: '/cgo', allowedRoles: ['CGO'] },
  { prefix: '/ceo', allowedRoles: ['CEO'] },
  { prefix: '/cfo', allowedRoles: ['CFO'] },
  { prefix: '/dev', allowedRoles: ['DEVELOPER', 'CGO', 'CEO'] },
  { prefix: '/developer', allowedRoles: ['DEVELOPER', 'CGO', 'CEO'] },
  { prefix: '/mod', allowedRoles: ['COMMUNITY_MODERATOR', 'ADMIN'] },
  { prefix: '/admin', allowedRoles: ['ADMIN'] },
  { prefix: '/api/cgo', allowedRoles: ['CGO'] },
  { prefix: '/api/ceo', allowedRoles: ['CEO'] },
  { prefix: '/api/cfo', allowedRoles: ['CFO'] },
  { prefix: '/api/dev', allowedRoles: ['DEVELOPER', 'CGO', 'CEO'] },
  { prefix: '/api/developer', allowedRoles: ['DEVELOPER', 'CGO', 'CEO'] },
  { prefix: '/api/mod', allowedRoles: ['COMMUNITY_MODERATOR', 'ADMIN'] },
  { prefix: '/api/admin', allowedRoles: ['ADMIN'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRoute = PROTECTED_ROUTES.find((r) => pathname.startsWith(r.prefix));
  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Extract token from cookie or Authorization header
  let token = request.cookies.get('xynvora_token')?.value || request.cookies.get('sb-access-token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Session expired. Please log in again.' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }

  const userRole = normalizeRole(payload.role);

  if (!matchedRoute.allowedRoles.includes(userRole)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied. Route requires ${matchedRoute.allowedRoles.join(' or ')}. Your role: ${userRole}`,
        },
        { status: 403 }
      );
    }
    return new NextResponse('Forbidden: Access denied to this executive portal.', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cgo/:path*',
    '/ceo/:path*',
    '/cfo/:path*',
    '/dev/:path*',
    '/developer/:path*',
    '/mod/:path*',
    '/admin/:path*',
    '/api/cgo/:path*',
    '/api/ceo/:path*',
    '/api/cfo/:path*',
    '/api/dev/:path*',
    '/api/developer/:path*',
    '/api/mod/:path*',
    '/api/admin/:path*',
  ],
};
