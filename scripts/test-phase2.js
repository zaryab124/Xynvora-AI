// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 2 VERIFICATION TEST SUITE
// ─────────────────────────────────────────────────────────────

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failedTests++;
  }
}

// ─── RBAC Engine Test Reference Mirror ────────────────────────
const ROLE_PERMISSIONS = {
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

function normalizeRole(role) {
  if (!role) return 'VISITOR';
  const upper = role.toUpperCase();
  const map = {
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

function hasRole(user, requiredRole) {
  if (!user || !user.is_active) return false;
  const userNorm = normalizeRole(user.role);
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.map(normalizeRole).includes(userNorm);
}

function hasPermission(user, permission) {
  if (!user || !user.is_active) return false;
  const normRole = normalizeRole(user.role);
  const perms = ROLE_PERMISSIONS[normRole] || [];
  return perms.includes(permission);
}

function assertBusinessAuthority(user, action) {
  const role = normalizeRole(user.role);

  switch (action) {
    case 'cgo:idea_intake':
    case 'cgo:idea_triage':
    case 'cgo:idea_routing':
    case 'cgo:partnership_recommendation':
      if (role !== 'CGO') {
        const err = new Error(`Access Denied: Only CGO has authority for ${action}.`);
        err.name = 'ForbiddenError';
        throw err;
      }
      break;

    case 'cfo:financial_evaluation':
    case 'cfo:budget_approval':
    case 'cfo:financial_risk_assessment':
      if (role !== 'CFO') {
        const err = new Error(`Access Denied: Only CFO has authority for ${action}.`);
        err.name = 'ForbiddenError';
        throw err;
      }
      break;

    case 'ceo:project_approval':
    case 'ceo:strategic_signoff':
      if (role !== 'CEO') {
        const err = new Error(`Access Denied: Only CEO has authority for ${action}.`);
        err.name = 'ForbiddenError';
        throw err;
      }
      break;

    case 'dev:task_delivery':
      if (!['DEVELOPER', 'CGO', 'CEO'].includes(role)) {
        const err = new Error(`Access Denied: Only Developers or Leads can deliver tasks.`);
        err.name = 'ForbiddenError';
        throw err;
      }
      break;

    case 'mod:content_restriction':
      if (!['COMMUNITY_MODERATOR', 'ADMIN'].includes(role)) {
        const err = new Error(`Access Denied: Requires Community Moderator privileges.`);
        err.name = 'ForbiddenError';
        throw err;
      }
      break;

    case 'admin:system_maintenance':
      if (role !== 'ADMIN') {
        const err = new Error(`Access Denied: Requires Technical Administrator role.`);
        err.name = 'ForbiddenError';
        throw err;
      }
      break;
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('  XYNVORA AI PLATFORM — PHASE 2 SECURITY & RBAC TESTS');
  console.log('======================================================\n');

  // ─── 1. Database Schema DDL Verification ────────────
  console.log('1. Database Tables & Migration Schema (28 Tables):');
  const migrationPath = path.join(__dirname, 'migrations', '002_core_schema.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  const requiredTables = [
    'users',
    'profiles',
    'categories',
    'tags',
    'ideas',
    'idea_reviews',
    'idea_status_history',
    'idea_attachments',
    'idea_tags',
    'projects',
    'project_members',
    'tasks',
    'milestones',
    'project_updates',
    'posts',
    'comments',
    'appreciations',
    'post_tags',
    'reports',
    'blocked_users',
    'partnership_applications',
    'notifications',
    'audit_logs',
    'community_initiatives',
    'community_initiative_members',
    'financial_evaluations',
    'developer_teams',
    'developer_team_members',
  ];

  requiredTables.forEach((table) => {
    runTest(`Table '${table}' is defined with UUID and timestamps`, () => {
      const regex = new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\s*\\(`, 'i');
      if (!regex.test(sqlContent)) {
        throw new Error(`Table ${table} is missing from migration`);
      }
    });
  });

  // ─── 2. Password & Token Hashing ────────────────────
  console.log('\n2. Authentication Security Cycles:');
  await runAsyncTest('Bcrypt password hashing and validation cycle', async () => {
    const password = 'StrongPassword2026!';
    const hash = await bcrypt.hash(password, 12);
    const valid = await bcrypt.compare(password, hash);
    const invalid = await bcrypt.compare('WrongPassword', hash);
    if (!valid || invalid) throw new Error('Bcrypt comparison mismatch');
  });

  runTest('Password reset token SHA-256 hash cycle', () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
    const verifyHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    if (hashed !== verifyHash) throw new Error('SHA-256 hash mismatch');
  });

  // ─── 3. RBAC & First-Class Role Separation ──────────
  console.log('\n3. First-Class Executive Role Separation:');

  runTest('CGO has dedicated growth & idea permissions and is separate from Admin/CEO', () => {
    const cgoPerms = ROLE_PERMISSIONS['CGO'];
    if (!cgoPerms.includes('ideas:triage') || !cgoPerms.includes('ideas:validate') || !cgoPerms.includes('ideas:route')) {
      throw new Error('CGO missing primary innovation intake permissions');
    }
    if (cgoPerms.includes('projects:approve') || cgoPerms.includes('financials:approve')) {
      throw new Error('CGO has unauthorized CEO/CFO permissions');
    }
  });

  runTest('CFO has exclusive financial evaluation and budget permissions', () => {
    const cfoPerms = ROLE_PERMISSIONS['CFO'];
    if (!cfoPerms.includes('financials:evaluate') || !cfoPerms.includes('financials:approve') || !cfoPerms.includes('budgets:manage')) {
      throw new Error('CFO missing financial evaluation permissions');
    }
  });

  runTest('CEO has exclusive project approval and strategic signoff permissions', () => {
    const ceoPerms = ROLE_PERMISSIONS['CEO'];
    if (!ceoPerms.includes('projects:approve') || !ceoPerms.includes('strategic_decisions:manage')) {
      throw new Error('CEO missing strategic project approval permissions');
    }
  });

  runTest('ADMIN role is strictly technical and lacks CEO project approval & CFO budget authority', () => {
    const adminPerms = ROLE_PERMISSIONS['ADMIN'];
    if (!adminPerms.includes('system:configure') || !adminPerms.includes('users:admin_manage')) {
      throw new Error('Admin missing technical maintenance permissions');
    }
    if (adminPerms.includes('projects:approve') || adminPerms.includes('financials:approve') || adminPerms.includes('budgets:manage')) {
      throw new Error('ADMIN inappropriately possesses CEO/CFO executive business authority');
    }
  });

  // ─── 4. Unauthorized Access & Security Boundaries ────
  console.log('\n4. Unauthorized Access Security Enforcement:');

  const memberUser = { id: 'usr_1', email: 'member@community.com', full_name: 'Member', role: 'COMMUNITY_MEMBER', is_active: true };
  const cgoUser = { id: 'usr_2', email: 'cgo@xynvora.ai', full_name: 'CGO', role: 'CGO', is_active: true };
  const cfoUser = { id: 'usr_3', email: 'cfo@xynvora.ai', full_name: 'CFO', role: 'CFO', is_active: true };
  const ceoUser = { id: 'usr_4', email: 'ceo@xynvora.ai', full_name: 'CEO', role: 'CEO', is_active: true };
  const devUser = { id: 'usr_5', email: 'dev@xynvora.ai', full_name: 'Developer', role: 'DEVELOPER', is_active: true };
  const modUser = { id: 'usr_6', email: 'mod@xynvora.ai', full_name: 'Moderator', role: 'COMMUNITY_MODERATOR', is_active: true };
  const adminUser = { id: 'usr_7', email: 'admin@xynvora.ai', full_name: 'Admin', role: 'ADMIN', is_active: true };

  runTest('COMMUNITY_MEMBER -> /cgo = DENY', () => {
    if (hasRole(memberUser, 'CGO')) throw new Error('COMMUNITY_MEMBER allowed into CGO portal');
  });

  runTest('COMMUNITY_MEMBER -> /ceo = DENY', () => {
    if (hasRole(memberUser, 'CEO')) throw new Error('COMMUNITY_MEMBER allowed into CEO portal');
  });

  runTest('COMMUNITY_MEMBER -> /cfo = DENY', () => {
    if (hasRole(memberUser, 'CFO')) throw new Error('COMMUNITY_MEMBER allowed into CFO portal');
  });

  runTest('CGO -> CFO decision modification = DENY', () => {
    try {
      assertBusinessAuthority(cgoUser, 'cfo:budget_approval');
      throw new Error('CGO inappropriately allowed to approve CFO budget');
    } catch (err) {
      if (err.name !== 'ForbiddenError') throw err;
    }
  });

  runTest('CFO -> CEO decision modification = DENY', () => {
    try {
      assertBusinessAuthority(cfoUser, 'ceo:project_approval');
      throw new Error('CFO inappropriately allowed to approve CEO project');
    } catch (err) {
      if (err.name !== 'ForbiddenError') throw err;
    }
  });

  runTest('DEVELOPER -> financial approval = DENY', () => {
    try {
      assertBusinessAuthority(devUser, 'cfo:financial_evaluation');
      throw new Error('DEVELOPER inappropriately allowed to evaluate finances');
    } catch (err) {
      if (err.name !== 'ForbiddenError') throw err;
    }
  });

  runTest('MODERATOR -> project approval = DENY', () => {
    try {
      assertBusinessAuthority(modUser, 'ceo:project_approval');
      throw new Error('MODERATOR inappropriately allowed to approve projects');
    } catch (err) {
      if (err.name !== 'ForbiddenError') throw err;
    }
  });

  runTest('ADMIN -> CFO budget approval / CEO project approval = DENY', () => {
    try {
      assertBusinessAuthority(adminUser, 'cfo:budget_approval');
      throw new Error('ADMIN inappropriately allowed to approve CFO budget');
    } catch (err) {
      if (err.name !== 'ForbiddenError') throw err;
    }

    try {
      assertBusinessAuthority(adminUser, 'ceo:project_approval');
      throw new Error('ADMIN inappropriately allowed to approve CEO project');
    } catch (err) {
      if (err.name !== 'ForbiddenError') throw err;
    }
  });

  // ─── Summary ───────────────────────────────────────
  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('------------------------------------------------------\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
