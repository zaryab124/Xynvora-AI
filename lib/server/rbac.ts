// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — RBAC & DOMAIN AUTHORITY ENGINE
// ─────────────────────────────────────────────────────────────

import { ForbiddenError } from './api-response';
import { logger } from './logger';
import { Permission, UserProfile, UserRole } from './types';

/**
 * Normalized role resolver (handles uppercase and lowercase aliases)
 */
export function normalizeRole(role: UserRole | string): UserRole {
  const upper = role.toUpperCase();
  if (['VISITOR', 'COMMUNITY_MEMBER', 'CGO', 'CEO', 'CFO', 'DEVELOPER', 'COMMUNITY_MODERATOR', 'ADMIN'].includes(upper)) {
    return upper as UserRole;
  }
  const map: Record<string, UserRole> = {
    super_admin: 'ADMIN',
    admin: 'ADMIN',
    cgo: 'CGO',
    ceo: 'CEO',
    cfo: 'CFO',
    developer: 'DEVELOPER',
    employee: 'DEVELOPER',
    manager: 'CGO',
    member: 'COMMUNITY_MEMBER',
    client: 'COMMUNITY_MEMBER',
  };
  return map[role.toLowerCase()] || 'COMMUNITY_MEMBER';
}

/**
 * Strict role-to-permission mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  VISITOR: ['public:view'],

  COMMUNITY_MEMBER: [
    'public:view',
    'community:read',
    'community:post',
    'community:comment',
    'community:appreciate',
    'ideas:submit',
    'ideas:view_public',
    'own_content:manage',
  ],

  CGO: [
    'public:view',
    'cgo:access',
    'community:read',
    'community:post',
    'community:comment',
    'community:appreciate',
    'ideas:submit',
    'ideas:view_all',
    'ideas:triage',
    'ideas:validate',
    'ideas:categorize',
    'ideas:route',
    'contributors:manage',
    'initiatives:manage',
    'analytics:growth_view',
    'partnerships:recommend',
    'leads:manage',
    'audit:view',
  ],

  CEO: [
    'public:view',
    'ceo:access',
    'community:read',
    'projects:approve',
    'company:manage',
    'strategic_decisions:manage',
    'exec:view_all',
    'ideas:view_all',
    'audit:view',
  ],

  CFO: [
    'public:view',
    'cfo:access',
    'community:read',
    'financials:evaluate',
    'financials:approve',
    'budgets:manage',
    'financial_risk:assess',
    'invoices:manage',
    'exec:view_all',
    'ideas:view_all',
    'audit:view',
  ],

  DEVELOPER: [
    'public:view',
    'dev:access',
    'community:read',
    'community:post',
    'community:comment',
    'projects:view_assigned',
    'tasks:manage_assigned',
    'milestones:update',
    'technical_work:submit',
    'ideas:submit',
  ],

  COMMUNITY_MODERATOR: [
    'public:view',
    'mod:access',
    'community:read',
    'community:post',
    'community:comment',
    'reports:view',
    'reports:resolve',
    'content:moderate',
    'users:restrict',
    'audit:view',
  ],

  ADMIN: [
    'public:view',
    'admin:access',
    'system:configure',
    'system:maintenance',
    'users:admin_manage',
    'audit:view',
  ],
};

/**
 * Check if a user possesses a specific role
 */
export function hasRole(user: UserProfile | null, requiredRole: UserRole | UserRole[]): boolean {
  if (!user || !user.is_active) return false;
  const userNormRole = normalizeRole(user.role);
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.map(normalizeRole).includes(userNormRole);
}

/**
 * Check if a user possesses a specific permission
 */
export function hasPermission(user: UserProfile | null, permission: Permission): boolean {
  if (!user || !user.is_active) return false;
  const normRole = normalizeRole(user.role);
  const perms = ROLE_PERMISSIONS[normRole] || [];
  return perms.includes(permission);
}

export type BusinessDomainAction =
  | 'cgo:idea_intake'
  | 'cgo:idea_triage'
  | 'cgo:idea_routing'
  | 'cgo:partnership_recommendation'
  | 'cfo:financial_evaluation'
  | 'cfo:budget_approval'
  | 'cfo:financial_risk_assessment'
  | 'ceo:project_approval'
  | 'ceo:strategic_signoff'
  | 'dev:task_delivery'
  | 'mod:content_restriction'
  | 'admin:system_maintenance';

/**
 * Strictly enforce domain business authority boundaries.
 * Guarantees that:
 * - CGO cannot modify CFO financial evaluations
 * - CFO cannot override CEO project approvals
 * - DEVELOPER cannot approve finances
 * - MODERATOR cannot approve projects
 * - ADMIN cannot override executive business decisions
 */
export function assertBusinessAuthority(user: UserProfile, action: BusinessDomainAction): void {
  const role = normalizeRole(user.role);

  switch (action) {
    case 'cgo:idea_intake':
    case 'cgo:idea_triage':
    case 'cgo:idea_routing':
    case 'cgo:partnership_recommendation':
      if (role !== 'CGO') {
        logger.warn(`Security violation: User ${user.id} (${role}) attempted CGO business action ${action}`, undefined, 'RBAC');
        throw new ForbiddenError(`Access Denied: Only the Chief Growth Officer (CGO) has authority for ${action}.`);
      }
      break;

    case 'cfo:financial_evaluation':
    case 'cfo:budget_approval':
    case 'cfo:financial_risk_assessment':
      if (role !== 'CFO') {
        logger.warn(`Security violation: User ${user.id} (${role}) attempted CFO financial action ${action}`, undefined, 'RBAC');
        throw new ForbiddenError(`Access Denied: Only the Chief Financial Officer (CFO) has authority for ${action}.`);
      }
      break;

    case 'ceo:project_approval':
    case 'ceo:strategic_signoff':
      if (role !== 'CEO') {
        logger.warn(`Security violation: User ${user.id} (${role}) attempted CEO strategic action ${action}`, undefined, 'RBAC');
        throw new ForbiddenError(`Access Denied: Only the Chief Executive Officer (CEO) has authority for ${action}.`);
      }
      break;

    case 'dev:task_delivery':
      if (!['DEVELOPER', 'CGO', 'CEO'].includes(role)) {
        throw new ForbiddenError(`Access Denied: Only Developers or Project Leads can deliver tasks.`);
      }
      break;

    case 'mod:content_restriction':
      if (!['COMMUNITY_MODERATOR', 'ADMIN'].includes(role)) {
        throw new ForbiddenError(`Access Denied: Requires Community Moderator or Administrator privileges.`);
      }
      break;

    case 'admin:system_maintenance':
      if (role !== 'ADMIN') {
        throw new ForbiddenError(`Access Denied: Requires Technical Administrator role.`);
      }
      break;
  }
}
