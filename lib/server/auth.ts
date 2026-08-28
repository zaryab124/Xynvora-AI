// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — SERVER-SIDE AUTH & AUTHORIZATION
// ─────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { AuthError, ForbiddenError } from './api-response';
import { query } from './db';
import { logger } from './logger';
import { hasPermission, hasRole, normalizeRole } from './rbac';
import { Permission, UserProfile, UserRole } from './types';

interface DecodedToken {
  id?: string;
  sub?: string;
  email?: string;
  role?: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Extract token from Authorization header or Cookie header
 */
export function extractToken(reqHeaders?: Headers): string | null {
  const h = reqHeaders || headers();
  const authHeader = h.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  const cookieHeader = h.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)(?:xynvora_token|sb-access-token)=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }

  return null;
}

/**
 * Inspect request and retrieve authenticated user profile (or null if unauthenticated)
 */
export async function auth(reqHeaders?: Headers): Promise<UserProfile | null> {
  try {
    const token = extractToken(reqHeaders);
    if (!token) return null;

    const secret =
      process.env.SUPABASE_JWT_SECRET ||
      process.env.JWT_SECRET ||
      'xynvora_development_jwt_secret_change_in_production_super_secure_key';
    const decoded = jwt.verify(token, secret) as DecodedToken;
    const userId = decoded.id || decoded.sub;

    if (!userId) return null;

    // Fetch user profile from PostgreSQL
    try {
      const res = await query<UserProfile>(
        `SELECT p.id, u.email, p.full_name, p.role, p.avatar_url, p.phone, p.department, p.position,
                p.company, p.linkedin_url, p.github_url, p.reputation_score, u.is_active, u.is_verified,
                u.last_login_at, p.created_at, p.updated_at
         FROM profiles p
         JOIN users u ON u.id = p.user_id
         WHERE p.id = $1 OR u.id = $1`,
        [userId]
      );

      if (res.rows.length === 0) {
        // Fallback for profiles without separate users table if pre-migration
        const fallbackRes = await query<UserProfile>(
          'SELECT id, email, full_name, role, avatar_url, phone, department, position, company, linkedin_url, is_active, is_verified, last_login_at, created_at, updated_at FROM profiles WHERE id = $1',
          [userId]
        );
        if (fallbackRes.rows.length > 0 && fallbackRes.rows[0].is_active) {
          return { ...fallbackRes.rows[0], role: normalizeRole(fallbackRes.rows[0].role) };
        }
        return null;
      }

      const user = res.rows[0];
      if (!user.is_active) return null;

      return {
        ...user,
        role: normalizeRole(user.role),
      };
    } catch {
      // Fallback to decoded token metadata during offline testing
      if (decoded.email && decoded.role) {
        return {
          id: userId,
          email: decoded.email,
          full_name: decoded.email.split('@')[0],
          role: normalizeRole(decoded.role),
          reputation_score: 100,
          is_active: true,
          is_verified: true,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }
      return null;
    }
  } catch (error) {
    logger.debug('Auth token verification failed', { error: error instanceof Error ? error.message : String(error) }, 'Auth');
    return null;
  }
}

/**
 * Require authentication. Throws AuthError (401) if not authenticated.
 */
export async function requireAuth(reqHeaders?: Headers): Promise<UserProfile> {
  const user = await auth(reqHeaders);
  if (!user) {
    throw new AuthError('Authentication required to access this resource.');
  }
  return user;
}

/**
 * Require specific role(s). Throws ForbiddenError (403) if role not satisfied.
 */
export async function requireRole(
  allowedRoles: UserRole | UserRole[],
  reqHeaders?: Headers
): Promise<UserProfile> {
  const user = await requireAuth(reqHeaders);

  if (hasRole(user, allowedRoles)) {
    return user;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  logger.warn('Role authorization failed', {
    userId: user.id,
    userRole: user.role,
    requiredRoles: roles,
  }, 'Auth');

  throw new ForbiddenError(`Access denied: Requires role ${roles.join(' or ')}.`);
}

/**
 * Require specific permission. Throws ForbiddenError (403) if permission not granted.
 */
export async function requirePermission(
  permission: Permission,
  reqHeaders?: Headers
): Promise<UserProfile> {
  const user = await requireAuth(reqHeaders);

  if (hasPermission(user, permission)) {
    return user;
  }

  logger.warn('Permission authorization failed', {
    userId: user.id,
    userRole: user.role,
    requiredPermission: permission,
  }, 'Auth');

  throw new ForbiddenError(`Access denied: Missing permission '${permission}'.`);
}

/**
 * Sign a JWT token for a user
 */
export function signAuthToken(user: { id: string; email: string; role: UserRole }): string {
  const secret =
    process.env.SUPABASE_JWT_SECRET ||
    process.env.JWT_SECRET ||
    'xynvora_development_jwt_secret_change_in_production_super_secure_key';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: normalizeRole(user.role),
    },
    secret,
    { expiresIn }
  );
}
