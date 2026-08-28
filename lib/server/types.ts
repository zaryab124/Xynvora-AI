export type UserRole =
  | 'VISITOR'
  | 'COMMUNITY_MEMBER'
  | 'CGO'
  | 'CEO'
  | 'CFO'
  | 'DEVELOPER'
  | 'COMMUNITY_MODERATOR'
  | 'ADMIN';

export type Permission =
  // Visitor & Community
  | 'public:view'
  | 'community:read'
  | 'community:post'
  | 'community:comment'
  | 'community:appreciate'
  | 'ideas:submit'
  | 'ideas:view_public'
  | 'own_content:manage'

  // CGO (Chief Growth Officer)
  | 'cgo:access'
  | 'ideas:view_all'
  | 'ideas:triage'
  | 'ideas:validate'
  | 'ideas:categorize'
  | 'ideas:route'
  | 'contributors:manage'
  | 'initiatives:manage'
  | 'analytics:growth_view'
  | 'partnerships:recommend'
  | 'leads:manage'
  | 'audit:view'

  // CEO (Chief Executive Officer)
  | 'ceo:access'
  | 'projects:approve'
  | 'company:manage'
  | 'strategic_decisions:manage'
  | 'exec:view_all'

  // CFO (Chief Financial Officer)
  | 'cfo:access'
  | 'financials:evaluate'
  | 'financials:approve'
  | 'budgets:manage'
  | 'financial_risk:assess'
  | 'invoices:manage'

  // Developer
  | 'dev:access'
  | 'projects:read'
  | 'projects:view_assigned'
  | 'tasks:manage'
  | 'tasks:manage_assigned'
  | 'tasks:update_status'
  | 'milestones:update'
  | 'technical_work:submit'
  | 'code:commit'

  // Community Moderator
  | 'mod:access'
  | 'reports:manage'
  | 'reports:view'
  | 'reports:resolve'
  | 'content:moderate'
  | 'users:block'
  | 'users:restrict'

  // Admin
  | 'admin:access'
  | 'system:manage'
  | 'system:settings'
  | 'system:configure'
  | 'system:maintenance'
  | 'users:manage'
  | 'users:admin_manage'
  | 'users:manage_roles'
  | 'security:audit'
  | 'logs:view'
  | 'platform:diagnostics'
  | 'db:backup';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  department?: string | null;
  position?: string | null;
  company?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  reputation_score: number;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: Date | null;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  expiresAt: Date;
}

export interface AuditLogInput {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface NotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'lead' | 'task' | 'invoice' | 'COMMUNITY_REPLY' | 'IDEA_STATUS_CHANGE' | string;
  link?: string | null;
}

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  timestamp: string;
}
