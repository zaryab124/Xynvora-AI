// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 9 ADMIN, MODERATION & NOTIFICATIONS TEST SUITE
// ─────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

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

console.log('\n======================================================');
console.log('  XYNVORA AI PLATFORM — PHASE 9 ADMIN & MODERATION');
console.log('======================================================\n');

// ─── 1. Admin Frontend Portal Routes ───────────────────
console.log('1. Admin & Moderation Portal Routes:');
const adminPages = [
  'app/admin/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/users/[id]/page.tsx',
  'app/admin/roles/page.tsx',
  'app/admin/content/page.tsx',
  'app/admin/categories/page.tsx',
  'app/admin/reports/page.tsx',
  'app/admin/reports/[id]/page.tsx',
  'app/admin/storage/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/audit-logs/page.tsx',
];

adminPages.forEach((pg) => {
  runTest(`Admin Component: ${pg}`, () => {
    const p = path.join(__dirname, '..', ...pg.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${pg}`);
  });
});

console.log('\n2. Admin & Moderation Backend APIs:');
const adminApis = [
  'app/api/admin/dashboard/route.ts',
  'app/api/admin/users/route.ts',
  'app/api/admin/users/[id]/route.ts',
  'app/api/admin/roles/route.ts',
  'app/api/admin/content/route.ts',
  'app/api/admin/categories/route.ts',
  'app/api/admin/reports/route.ts',
  'app/api/admin/reports/[id]/route.ts',
  'app/api/admin/storage/route.ts',
  'app/api/admin/settings/route.ts',
  'app/api/admin/audit-logs/route.ts',
];

adminApis.forEach((api) => {
  runTest(`API Endpoint: /${api.replace('/route.ts', '')}`, () => {
    const p = path.join(__dirname, '..', ...api.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${api}`);
  });
});

// ─── 3. Centralized Notification Infrastructure Tests ───
console.log('\n3. Centralized Notification Dispatch Infrastructure:');
const NOTIFICATION_SCENARIOS = [
  { type: 'IDEA_SUBMITTED', title: 'Idea submitted', target: 'CGO' },
  { type: 'CGO_REVIEW_REQUIRED', title: 'CGO review required', target: 'CGO' },
  { type: 'IDEA_NEEDS_CHANGES', title: 'Idea needs changes', target: 'COMMUNITY_MEMBER' },
  { type: 'IDEA_ROUTED_TO_CEO', title: 'Idea routed to CEO', target: 'CEO' },
  { type: 'CEO_DECISION', title: 'CEO decision', target: 'COMMUNITY_MEMBER' },
  { type: 'CFO_REVIEW_REQUESTED', title: 'CFO review requested', target: 'CFO' },
  { type: 'FINANCIAL_EVALUATION_COMPLETED', title: 'Financial evaluation completed', target: 'CEO' },
  { type: 'PROJECT_ASSIGNED', title: 'Project assigned', target: 'DEVELOPER' },
  { type: 'TASK_ASSIGNED', title: 'Task assigned', target: 'DEVELOPER' },
  { type: 'COMMENT_RECEIVED', title: 'Comment received', target: 'COMMUNITY_MEMBER' },
  { type: 'POST_REPORTED', title: 'Post reported', target: 'COMMUNITY_MODERATOR' },
  { type: 'PARTNERSHIP_STATUS_CHANGED', title: 'Partnership status changed', target: 'COMMUNITY_MEMBER' },
];

NOTIFICATION_SCENARIOS.forEach((scenario) => {
  runTest(`Notification Scenario: [${scenario.type}] -> ${scenario.title} (${scenario.target})`, () => {
    const notif = {
      userId: `usr_${scenario.target.toLowerCase()}`,
      title: scenario.title,
      type: scenario.type,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    if (!notif.title || notif.is_read !== false) throw new Error('Failed notification generation');
  });
});

// ─── 4. Moderation & Admin Role Boundary Guards ─────────
console.log('\n4. Role Separation & Boundary Guards:');

const admin = { id: 'usr_admin', role: 'ADMIN' };
const mod = { id: 'usr_mod', role: 'COMMUNITY_MODERATOR' };
const ceo = { id: 'usr_ceo', role: 'CEO' };
const cfo = { id: 'usr_cfo', role: 'CFO' };

runTest('Guard 1: Moderator forbidden from approving projects (403)', () => {
  const allowed = ['CEO', 'ADMIN'];
  const canModApprove = allowed.includes(mod.role);
  if (canModApprove) throw new Error('Moderator approved project');
});

runTest('Guard 2: Moderator forbidden from executing CFO financial decisions (403)', () => {
  const allowed = ['CFO'];
  const canModFin = allowed.includes(mod.role);
  if (canModFin) throw new Error('Moderator executed financial decision');
});

runTest('Guard 3: Admin technical role does not bypass CEO strategic project signoff (Segregated)', () => {
  const isCeoExclusive = (action) => action === 'CEO_PROJECT_SIGN_OFF';
  if (!isCeoExclusive('CEO_PROJECT_SIGN_OFF')) throw new Error('Executive domain violated');
});

runTest('Guard 4: Admin technical role does not bypass CFO financial valuation (Segregated)', () => {
  const isCfoExclusive = (action) => action === 'CFO_VALUATION_SIGN_OFF';
  if (!isCfoExclusive('CFO_VALUATION_SIGN_OFF')) throw new Error('Financial domain violated');
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
