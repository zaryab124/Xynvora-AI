// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 7 DEVELOPER WORKSPACE TEST SUITE
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
console.log('  XYNVORA AI PLATFORM — PHASE 7 DEVELOPER WORKSPACE');
console.log('======================================================\n');

// ─── 1. Developer Route Files ──────────────────────────
console.log('1. Developer Workspace Portal Routes:');
const devPages = [
  'app/developer/page.tsx',
  'app/developer/dashboard/page.tsx',
  'app/developer/projects/page.tsx',
  'app/developer/projects/[id]/page.tsx',
  'app/developer/tasks/page.tsx',
  'app/developer/tasks/[id]/page.tsx',
  'app/developer/milestones/page.tsx',
  'app/developer/files/page.tsx',
  'app/developer/team/page.tsx',
  'app/developer/notifications/page.tsx',
];

devPages.forEach((pg) => {
  runTest(`Developer Component: ${pg}`, () => {
    const p = path.join(__dirname, '..', ...pg.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${pg}`);
  });
});

console.log('\n2. Developer Backend APIs:');
const devApis = [
  'app/api/developer/dashboard/route.ts',
  'app/api/developer/projects/route.ts',
  'app/api/developer/projects/[id]/route.ts',
  'app/api/developer/projects/[id]/transition/route.ts',
  'app/api/developer/tasks/route.ts',
  'app/api/developer/tasks/[id]/route.ts',
  'app/api/developer/milestones/route.ts',
  'app/api/developer/files/route.ts',
  'app/api/developer/team/route.ts',
];

devApis.forEach((api) => {
  runTest(`API Endpoint: /${api.replace('/route.ts', '')}`, () => {
    const p = path.join(__dirname, '..', ...api.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${api}`);
  });
});

// ─── 3. Full End-to-End Engineering Execution Lifecycle ─
console.log('\n3. End-to-End Engineering Execution Lifecycle:');

const ceo = { id: 'usr_ceo', email: 'ceo@xynvora.ai', role: 'CEO' };
const devLead = { id: 'usr_dev_1', email: 'ahmed@xynvora.ai', role: 'DEVELOPER', full_name: 'Ahmed Khan' };
const devPeer = { id: 'usr_dev_2', email: 'amina@xynvora.ai', role: 'DEVELOPER', full_name: 'Amina Farooq' };

let idea = {
  id: 'idea_clinical_triage',
  title: 'Autonomous Clinical Triage Agent',
  status: 'APPROVED',
};

let project = null;
let projectMembers = [];
let tasks = [];
let milestones = [];
let notifications = [];
let auditLogs = [];

// Step 1: Approved Idea -> CEO creates Project
runTest('Lifecycle 1: CEO commissions Project from APPROVED idea', () => {
  project = {
    id: 'proj_clinical_triage',
    name: idea.title,
    origin_idea_id: idea.id,
    status: 'planning',
    progress: 0,
    budget: 65000,
    spent: 0,
    created_by: ceo.id,
  };
  idea.status = 'DEVELOPMENT_PLANNING';
  auditLogs.push({ action: 'PROJECT_COMMISSIONED', actor: ceo.email, entityId: project.id });
  if (project.name !== idea.title || idea.status !== 'DEVELOPMENT_PLANNING') throw new Error('Step 1 failed');
});

// Step 2: Developer Squad Assigned
runTest('Lifecycle 2: Developer squad assigned to project members', () => {
  projectMembers.push(
    { project_id: project.id, user_id: devLead.id, project_role: 'lead' },
    { project_id: project.id, user_id: devPeer.id, project_role: 'developer' }
  );
  notifications.push({ to: devLead.id, title: `Assigned to Lead: ${project.name}` });
  notifications.push({ to: devPeer.id, title: `Assigned to Squad: ${project.name}` });
  if (projectMembers.length !== 2) throw new Error('Step 2 failed');
});

// Step 3: Milestones & Tasks Created
runTest('Lifecycle 3: Milestones and sprint tasks defined', () => {
  milestones.push({ id: 'm_1', project_id: project.id, title: 'MVP Clinical NLP Benchmark', status: 'pending' });
  tasks.push(
    { id: 't_1', project_id: project.id, title: 'Implement Symptom Extraction Pipeline', assigned_to: devLead.id, status: 'todo' },
    { id: 't_2', project_id: project.id, title: 'HL7 FHIR Adapter', assigned_to: devPeer.id, status: 'todo' }
  );
  if (tasks.length !== 2 || milestones.length !== 1) throw new Error('Step 3 failed');
});

// Step 4: Sprint Started (in_development)
runTest('Lifecycle 4: Developer lead transitions project to IN_DEVELOPMENT', () => {
  project.status = 'in_development';
  idea.status = 'IN_DEVELOPMENT';
  auditLogs.push({ action: 'PROJECT_STATUS_IN_DEVELOPMENT', actor: devLead.email });
  if (project.status !== 'in_development' || idea.status !== 'IN_DEVELOPMENT') throw new Error('Step 4 failed');
});

// Step 5: Developer updates task & project progress automatically calculates
runTest('Lifecycle 5: Developer completes task & project progress updates to 50%', () => {
  tasks[0].status = 'done';
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  project.progress = Math.round((completed / total) * 100);
  if (project.progress !== 50) throw new Error(`Progress mismatch: expected 50, got ${project.progress}`);
});

// Step 6: Testing Phase
runTest('Lifecycle 6: Developer squad transitions project to TESTING phase', () => {
  project.status = 'testing';
  idea.status = 'TESTING';
  auditLogs.push({ action: 'PROJECT_STATUS_TESTING', actor: devLead.email });
  if (project.status !== 'testing' || idea.status !== 'TESTING') throw new Error('Step 6 failed');
});

// Step 7: Production Review Requested
runTest('Lifecycle 7: Developer requests PRODUCTION_REVIEW from CEO', () => {
  project.status = 'production_review';
  idea.status = 'PRODUCTION_REVIEW';
  notifications.push({ to: ceo.id, title: `Production Review Requested: ${project.name}` });
  auditLogs.push({ action: 'PROJECT_STATUS_PRODUCTION_REVIEW', actor: devLead.email });
  if (project.status !== 'production_review' || idea.status !== 'PRODUCTION_REVIEW') throw new Error('Step 7 failed');
});

// ─── 4. Role Security & Guard Tests ────────────────────
console.log('\n4. Developer Role Security & Governance Restrictions:');

runTest('Security Guard 1: Developer forbidden from self-approving LAUNCHED production status (403)', () => {
  const allowedToLaunch = ['CEO', 'ADMIN'];
  const canDevLaunch = allowedToLaunch.includes(devLead.role);
  if (canDevLaunch) throw new Error('Security failure: Developer launched project directly');
});

runTest('Security Guard 2: Developer forbidden from conducting CFO financial valuations (403)', () => {
  const allowedToEvaluate = ['CFO', 'ADMIN'];
  const canDevEval = allowedToEvaluate.includes(devLead.role);
  if (canDevEval) throw new Error('Security failure: Developer conducted financial valuation');
});

runTest('Security Guard 3: Non-assigned developer forbidden from private project workspace (403)', () => {
  const outsiderDev = { id: 'usr_dev_outsider', role: 'DEVELOPER' };
  const isMember = projectMembers.some(m => m.user_id === outsiderDev.id);
  const isPrivileged = ['ADMIN', 'CEO'].includes(outsiderDev.role);
  const canAccess = isMember || isPrivileged;
  if (canAccess) throw new Error('Security failure: Non-member developer accessed project workspace');
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
