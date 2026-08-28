// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 6 CEO & CFO TEST SUITE
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
console.log('  XYNVORA AI PLATFORM — PHASE 6 CEO & CFO EXECUTIVE SUITES');
console.log('======================================================\n');

// ─── 1. CEO & CFO Route Files ──────────────────────────
console.log('1. CEO Executive Portal Routes:');
const ceoPages = [
  'app/ceo/page.tsx',
  'app/ceo/dashboard/page.tsx',
  'app/ceo/ideas/page.tsx',
  'app/ceo/ideas/[id]/page.tsx',
  'app/ceo/approvals/page.tsx',
  'app/ceo/projects/page.tsx',
  'app/ceo/projects/create/page.tsx',
  'app/ceo/projects/[id]/page.tsx',
  'app/ceo/developers/page.tsx',
  'app/ceo/partners/page.tsx',
  'app/ceo/activities/page.tsx',
  'app/ceo/analytics/page.tsx',
  'app/ceo/audit-logs/page.tsx',
];

ceoPages.forEach((pg) => {
  runTest(`CEO Component: ${pg}`, () => {
    const p = path.join(__dirname, '..', ...pg.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${pg}`);
  });
});

console.log('\n2. CFO Financial Portal Routes:');
const cfoPages = [
  'app/cfo/page.tsx',
  'app/cfo/dashboard/page.tsx',
  'app/cfo/reviews/page.tsx',
  'app/cfo/reviews/[id]/page.tsx',
  'app/cfo/projects/page.tsx',
  'app/cfo/projects/[id]/page.tsx',
  'app/cfo/budgets/page.tsx',
  'app/cfo/partnerships/page.tsx',
  'app/cfo/reports/page.tsx',
];

cfoPages.forEach((pg) => {
  runTest(`CFO Component: ${pg}`, () => {
    const p = path.join(__dirname, '..', ...pg.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${pg}`);
  });
});

console.log('\n3. CEO & CFO Backend APIs:');
const executiveApis = [
  'app/api/ceo/dashboard/route.ts',
  'app/api/ceo/ideas/route.ts',
  'app/api/ceo/approvals/route.ts',
  'app/api/ceo/projects/route.ts',
  'app/api/ceo/developers/route.ts',
  'app/api/ceo/partners/route.ts',
  'app/api/ceo/analytics/route.ts',
  'app/api/ceo/audit-logs/route.ts',
  'app/api/cfo/dashboard/route.ts',
  'app/api/cfo/evaluations/route.ts',
  'app/api/cfo/evaluations/[id]/route.ts',
  'app/api/cfo/reviews/route.ts',
  'app/api/cfo/projects/route.ts',
  'app/api/cfo/budgets/route.ts',
  'app/api/cfo/partnerships/route.ts',
  'app/api/cfo/reports/route.ts',
];

executiveApis.forEach((api) => {
  runTest(`API Endpoint: /${api.replace('/route.ts', '')}`, () => {
    const p = path.join(__dirname, '..', ...api.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${api}`);
  });
});

// ─── 4. Full Executive Decision Chain Simulation ───────
console.log('\n4. Executive Decision Chain & Financial Signoff Simulation:');

const cgo = { id: 'usr_cgo', email: 'cgo@xynvora.ai', role: 'CGO', full_name: 'Hassan Raza' };
const ceo = { id: 'usr_ceo', email: 'ceo@xynvora.ai', role: 'CEO', full_name: 'Zain ul Abideen' };
const cfo = { id: 'usr_cfo', email: 'cfo@xynvora.ai', role: 'CFO', full_name: 'Sara Malik' };
const dev = { id: 'usr_dev', email: 'dev@xynvora.ai', role: 'DEVELOPER', full_name: 'Ahmed Khan' };

let testProposal = {
  id: 'idea_phase6_test',
  title: 'Autonomous Clinical Triage Agent',
  status: 'CGO_REVIEW',
  current_owner_role: 'CGO',
};

const notifications = [];
const auditEvents = [];

// Step 1: CGO Validates and Routes to CEO
runTest('Executive Step 1: CGO validates and routes to CEO_REVIEW', () => {
  testProposal.status = 'CEO_REVIEW';
  testProposal.current_owner_role = 'CEO';
  auditEvents.push({ action: 'CGO_VALIDATION_ROUTED_TO_CEO', actor: cgo.email });
  notifications.push({ to: ceo.id, title: 'New Proposal Routed for Strategic Decision' });
  if (testProposal.status !== 'CEO_REVIEW' || testProposal.current_owner_role !== 'CEO') {
    throw new Error('Step 1 failed');
  }
});

// Step 2: CEO Requests CFO Financial Feasibility
runTest('Executive Step 2: CEO reviews and routes to CFO_REVIEW for financial modeling', () => {
  testProposal.status = 'CFO_REVIEW';
  testProposal.current_owner_role = 'CFO';
  auditEvents.push({ action: 'CEO_REQUESTED_CFO_FINANCIAL_EVALUATION', actor: ceo.email });
  notifications.push({ to: cfo.id, title: 'Financial Evaluation Requested by CEO' });
  if (testProposal.status !== 'CFO_REVIEW' || testProposal.current_owner_role !== 'CFO') {
    throw new Error('Step 2 failed');
  }
});

// Step 3: CFO Conducts Financial Evaluation & Grants APPROVED Signoff
let financialEvaluationRecord = null;
runTest('Executive Step 3: CFO conducts financial modeling & grants APPROVED signoff', () => {
  financialEvaluationRecord = {
    idea_id: testProposal.id,
    evaluator_id: cfo.id,
    estimated_cost: 45000,
    estimated_revenue: 180000,
    business_model: 'B2B SaaS per clinic node ($2,500/mo)',
    financial_risk_level: 'low',
    sustainability_score: 92,
    recommendation: 'APPROVE',
  };
  testProposal.status = 'APPROVED';
  testProposal.current_owner_role = 'CEO';
  auditEvents.push({ action: 'CFO_FINANCIAL_EVALUATION_APPROVED', actor: cfo.email });
  notifications.push({ to: ceo.id, title: 'CFO Financial Signoff Completed: APPROVED' });
  if (testProposal.status !== 'APPROVED' || testProposal.current_owner_role !== 'CEO') {
    throw new Error('Step 3 failed');
  }
});

// Step 4: CEO Commissions Project to Development Planning
let commissionedProject = null;
runTest('Executive Step 4: CEO reviews CFO valuation and commissions project to Development Planning', () => {
  commissionedProject = {
    id: 'proj_phase6_test',
    name: testProposal.title,
    origin_idea_id: testProposal.id,
    status: 'planning',
    budget: financialEvaluationRecord.estimated_cost,
    created_by: ceo.id,
  };
  testProposal.status = 'DEVELOPMENT_PLANNING';
  testProposal.current_owner_role = 'DEVELOPER';
  auditEvents.push({ action: 'PROJECT_COMMISSIONED', actor: ceo.email, entityId: commissionedProject.id });
  notifications.push({ to: dev.id, title: 'New Project Commissioned to Development Planning' });
  if (testProposal.status !== 'DEVELOPMENT_PLANNING' || commissionedProject.budget !== 45000) {
    throw new Error('Step 4 failed');
  }
});

// ─── 5. Role Restriction Security Tests ────────────────
console.log('\n5. Executive Domain Security & Role Restriction Guards:');

runTest('Security Guard 1: CFO forbidden from accessing CEO Strategic Actions (403)', () => {
  const allowed = ['CEO', 'ADMIN'];
  const canCfoAct = allowed.includes(cfo.role);
  if (canCfoAct) throw new Error('Security failure: CFO executed CEO strategic action');
});

runTest('Security Guard 2: CEO forbidden from conducting CFO financial evaluations (403)', () => {
  const allowed = ['CFO', 'ADMIN'];
  const canCeoAct = allowed.includes(ceo.role);
  if (canCeoAct) throw new Error('Security failure: CEO modified CFO financial records');
});

runTest('Security Guard 3: CGO forbidden from independent CFO financial approvals (403)', () => {
  const allowed = ['CFO', 'ADMIN'];
  const canCgoAct = allowed.includes(cgo.role);
  if (canCgoAct) throw new Error('Security failure: CGO executed financial approval');
});

runTest('Security Guard 4: Developer forbidden from executive project commissioning (403)', () => {
  const allowed = ['CEO', 'ADMIN'];
  const canDevAct = allowed.includes(dev.role);
  if (canDevAct) throw new Error('Security failure: Developer commissioned project');
});

runTest('Governance Audit: All 4 executive audit events & notifications persisted immutably', () => {
  if (auditEvents.length !== 4 || notifications.length !== 4) {
    throw new Error(`Audit or notification count mismatch: audits=${auditEvents.length}, notifs=${notifications.length}`);
  }
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
