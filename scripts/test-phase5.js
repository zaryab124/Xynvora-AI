// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 5 INNOVATION PIPELINE TEST SUITE
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
console.log('  XYNVORA AI PLATFORM — PHASE 5 INNOVATION PIPELINE');
console.log('======================================================\n');

// ─── 1. Member Innovation & CGO Portal Route Files ─────
console.log('1. Member Innovation & CGO Portal Route Files:');
const requiredPages = [
  'app/ideas/page.tsx',
  'app/ideas/create/page.tsx',
  'app/ideas/[id]/page.tsx',
  'app/ideas/[id]/edit/page.tsx',
  'app/cgo/page.tsx',
  'app/cgo/dashboard/page.tsx',
  'app/cgo/ideas/page.tsx',
  'app/cgo/ideas/[id]/page.tsx',
  'app/cgo/community/page.tsx',
  'app/cgo/community/members/page.tsx',
  'app/cgo/community/initiatives/page.tsx',
  'app/cgo/growth/page.tsx',
  'app/cgo/contributors/page.tsx',
  'app/cgo/partnership-recommendations/page.tsx',
  'app/cgo/developers/page.tsx',
  'app/cgo/activities/page.tsx',
  'app/cgo/notifications/page.tsx',
  'app/cgo/audit-logs/page.tsx',
];

requiredPages.forEach((pg) => {
  runTest(`Page Component: ${pg}`, () => {
    const p = path.join(__dirname, '..', ...pg.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${pg}`);
  });
});

console.log('\n2. Ideas & CGO Backend API Endpoints:');
const requiredApis = [
  'app/api/ideas/route.ts',
  'app/api/ideas/[id]/route.ts',
  'app/api/ideas/[id]/transition/route.ts',
  'app/api/ideas/[id]/review/route.ts',
  'app/api/cgo/dashboard/route.ts',
  'app/api/cgo/growth/route.ts',
  'app/api/cgo/contributors/route.ts',
  'app/api/cgo/developers/route.ts',
  'app/api/cgo/audit-logs/route.ts',
  'app/api/cgo/community/members/route.ts',
  'app/api/cgo/community/initiatives/route.ts',
  'app/api/cgo/partnership-recommendations/route.ts',
];

requiredApis.forEach((api) => {
  runTest(`API Route: /${api.replace('/route.ts', '')}`, () => {
    const p = path.join(__dirname, '..', ...api.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${api}`);
  });
});

runTest('Backend Transition Engine: lib/server/idea-transitions.ts', () => {
  const p = path.join(__dirname, '..', 'lib', 'server', 'idea-transitions.ts');
  if (!fs.existsSync(p)) throw new Error('Missing idea-transitions.ts');
});

// ─── 3. Full State Machine & Authority Rules Simulation ─
console.log('\n3. Innovation Pipeline Lifecycle State Machine:');

const TRANSITION_RULES = {
  SUBMIT_DRAFT: {
    from: ['DRAFT'],
    to: 'SUBMITTED',
    allowedRoles: ['COMMUNITY_MEMBER', 'ADMIN', 'CGO', 'DEVELOPER'],
    requireOwner: true,
    nextOwnerRole: 'CGO',
    description: 'Submit initial innovation proposal to CGO intake queue.',
  },
  START_CGO_REVIEW: {
    from: ['SUBMITTED'],
    to: 'CGO_REVIEW',
    allowedRoles: ['CGO', 'ADMIN'],
    nextOwnerRole: 'CGO',
    description: 'CGO accepts proposal into active triage & market validation.',
  },
  CGO_REQUEST_CHANGES: {
    from: ['CGO_REVIEW', 'SUBMITTED'],
    to: 'NEEDS_CHANGES',
    allowedRoles: ['CGO', 'ADMIN'],
    nextOwnerRole: 'COMMUNITY_MEMBER',
    description: 'CGO requests revisions or technical clarification from submitter.',
  },
  CGO_REJECT: {
    from: ['CGO_REVIEW', 'SUBMITTED'],
    to: 'REJECTED',
    allowedRoles: ['CGO', 'ADMIN'],
    nextOwnerRole: 'CGO',
    description: 'CGO determines proposal is out of strategic alignment or non-viable.',
  },
  CGO_ROUTE_TO_CEO: {
    from: ['CGO_REVIEW', 'SUBMITTED'],
    to: 'CEO_REVIEW',
    allowedRoles: ['CGO', 'ADMIN'],
    nextOwnerRole: 'CEO',
    description: 'CGO validates market impact and routes proposal to CEO for strategic executive review.',
  },
  RESUBMIT_REVISED: {
    from: ['NEEDS_CHANGES'],
    to: 'SUBMITTED',
    allowedRoles: ['COMMUNITY_MEMBER', 'ADMIN', 'CGO', 'DEVELOPER'],
    requireOwner: true,
    nextOwnerRole: 'CGO',
    description: 'Submitter provides updated revisions and returns idea to CGO triage.',
  },
  CEO_REQUEST_CHANGES: {
    from: ['CEO_REVIEW'],
    to: 'NEEDS_CHANGES',
    allowedRoles: ['CEO', 'ADMIN'],
    nextOwnerRole: 'COMMUNITY_MEMBER',
    description: 'CEO requires further problem scoping before financial review.',
  },
  CEO_REJECT: {
    from: ['CEO_REVIEW'],
    to: 'REJECTED',
    allowedRoles: ['CEO', 'ADMIN'],
    nextOwnerRole: 'CEO',
    description: 'CEO decides not to proceed with project.',
  },
  CEO_ROUTE_TO_CFO: {
    from: ['CEO_REVIEW'],
    to: 'CFO_REVIEW',
    allowedRoles: ['CEO', 'ADMIN'],
    nextOwnerRole: 'CFO',
    description: 'CEO endorses strategic vision and routes to CFO for capital & budget feasibility.',
  },
  CFO_REQUEST_CHANGES: {
    from: ['CFO_REVIEW'],
    to: 'NEEDS_CHANGES',
    allowedRoles: ['CFO', 'ADMIN'],
    nextOwnerRole: 'COMMUNITY_MEMBER',
    description: 'CFO requires updated financial projections or cost model.',
  },
  CFO_REJECT: {
    from: ['CFO_REVIEW'],
    to: 'REJECTED',
    allowedRoles: ['CFO', 'ADMIN'],
    nextOwnerRole: 'CFO',
    description: 'CFO rejects project on financial risk or unit economics basis.',
  },
  CFO_APPROVE: {
    from: ['CFO_REVIEW'],
    to: 'APPROVED',
    allowedRoles: ['CFO', 'ADMIN'],
    nextOwnerRole: 'CEO',
    description: 'CFO approves budget allocation and validates enterprise ROI.',
  },
  COMMISSION_DEVELOPMENT_PLANNING: {
    from: ['APPROVED'],
    to: 'DEVELOPMENT_PLANNING',
    allowedRoles: ['CEO', 'ADMIN'],
    nextOwnerRole: 'DEVELOPER',
    description: 'Executive team commissions developer squad to architect sprint backlog.',
  },
  START_DEVELOPMENT: {
    from: ['DEVELOPMENT_PLANNING'],
    to: 'IN_DEVELOPMENT',
    allowedRoles: ['DEVELOPER', 'ADMIN'],
    nextOwnerRole: 'DEVELOPER',
    description: 'Engineering squad starts active sprint implementation.',
  },
  SUBMIT_FOR_TESTING: {
    from: ['IN_DEVELOPMENT'],
    to: 'TESTING',
    allowedRoles: ['DEVELOPER', 'ADMIN'],
    nextOwnerRole: 'DEVELOPER',
    description: 'Core agentic workflows submitted for QA & security benchmarking.',
  },
  SUBMIT_FOR_PRODUCTION_REVIEW: {
    from: ['TESTING'],
    to: 'PRODUCTION_REVIEW',
    allowedRoles: ['DEVELOPER', 'ADMIN'],
    nextOwnerRole: 'CEO',
    description: 'System passes QA and undergoes production deployment signoff.',
  },
  LAUNCH_PROJECT: {
    from: ['PRODUCTION_REVIEW'],
    to: 'LAUNCHED',
    allowedRoles: ['CEO', 'ADMIN'],
    nextOwnerRole: 'CEO',
    description: 'Production AI system goes live for enterprise users and public.',
  },
  TRANSITION_TO_BUSINESS_OPERATION: {
    from: ['LAUNCHED'],
    to: 'BUSINESS_OPERATION',
    allowedRoles: ['CEO', 'CGO', 'ADMIN'],
    nextOwnerRole: 'CGO',
    description: 'Live system enters standard recurring commercial operations.',
  },
};

const member = { id: 'usr_member', email: 'member@xynvora.ai', role: 'COMMUNITY_MEMBER', full_name: 'Member Innovator' };
const cgo = { id: 'usr_cgo', email: 'cgo@xynvora.ai', role: 'CGO', full_name: 'Hassan Raza' };
const ceo = { id: 'usr_ceo', email: 'ceo@xynvora.ai', role: 'CEO', full_name: 'Zain ul Abideen' };
const cfo = { id: 'usr_cfo', email: 'cfo@xynvora.ai', role: 'CFO', full_name: 'Sara Malik' };
const dev = { id: 'usr_dev', email: 'dev@xynvora.ai', role: 'DEVELOPER', full_name: 'Ahmed Khan' };

let currentIdea = {
  id: 'idea_pipeline_test_1',
  submitter_id: member.id,
  title: 'Autonomous Clinical Intake Assistant',
  status: 'DRAFT',
  current_owner_role: 'COMMUNITY_MEMBER',
};

const history = [];

function simulateTransition(newStatus, actor, notes) {
  const oldStatus = currentIdea.status;
  const matchedRuleKey = Object.keys(TRANSITION_RULES).find((k) => {
    const r = TRANSITION_RULES[k];
    return r.from.includes(oldStatus) && r.to === newStatus;
  });

  if (!matchedRuleKey) {
    throw new Error(`Illegal transition from ${oldStatus} to ${newStatus}`);
  }

  const rule = TRANSITION_RULES[matchedRuleKey];
  const hasRole = rule.allowedRoles.includes(actor.role) || actor.role === 'ADMIN';
  if (!hasRole) {
    throw new Error(`Forbidden: Role ${actor.role} not authorized for ${newStatus}`);
  }

  if (rule.requireOwner && currentIdea.submitter_id !== actor.id && actor.role !== 'ADMIN') {
    throw new Error('Forbidden: Only owner can submit');
  }

  currentIdea.status = newStatus;
  currentIdea.current_owner_role = rule.nextOwnerRole;
  history.push({
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: actor.full_name,
    role: actor.role,
    nextOwner: rule.nextOwnerRole,
    notes: notes || rule.description,
  });

  return currentIdea;
}

// 3.1 DRAFT -> SUBMITTED (Member)
runTest('Pipeline Step 1: Member submits DRAFT -> SUBMITTED (Assigned to CGO)', () => {
  simulateTransition('SUBMITTED', member, 'Initial problem proposal submitted.');
  if (currentIdea.status !== 'SUBMITTED' || currentIdea.current_owner_role !== 'CGO') {
    throw new Error('Step 1 failed');
  }
});

// 3.2 SUBMITTED -> CGO_REVIEW (CGO)
runTest('Pipeline Step 2: CGO accepts into CGO_REVIEW (Active Validation)', () => {
  simulateTransition('CGO_REVIEW', cgo, 'Accepted into active CGO triage.');
  if (currentIdea.status !== 'CGO_REVIEW' || currentIdea.current_owner_role !== 'CGO') {
    throw new Error('Step 2 failed');
  }
});

// 3.3 Security Guard: CGO CANNOT independently approve or bypass CEO
runTest('Security Guard: CGO forbidden from bypassing CEO directly to APPROVED (403)', () => {
  let blocked = false;
  try {
    simulateTransition('APPROVED', cgo, 'Attempt direct approval');
  } catch (err) {
    blocked = true;
  }
  if (!blocked) throw new Error('Security failure: CGO approved idea independently!');
});

// 3.4 CGO_REVIEW -> CEO_REVIEW (CGO Validates & Routes)
runTest('Pipeline Step 3: CGO validates and routes to CEO_REVIEW (Assigned to CEO)', () => {
  simulateTransition('CEO_REVIEW', cgo, 'Market validated with urgent priority. Routing to CEO.');
  if (currentIdea.status !== 'CEO_REVIEW' || currentIdea.current_owner_role !== 'CEO') {
    throw new Error('Step 3 failed');
  }
});

// 3.5 Security Guard: Developer cannot approve or route
runTest('Security Guard: Developer forbidden from routing CEO_REVIEW (403)', () => {
  let blocked = false;
  try {
    simulateTransition('CFO_REVIEW', dev, 'Dev attempt route');
  } catch (err) {
    blocked = true;
  }
  if (!blocked) throw new Error('Security failure: Developer routed idea!');
});

// 3.6 CEO_REVIEW -> CFO_REVIEW (CEO Routes for Financial Validation)
runTest('Pipeline Step 4: CEO reviews and routes to CFO_REVIEW (Assigned to CFO)', () => {
  simulateTransition('CFO_REVIEW', ceo, 'Strategic endorsement. Routed to CFO for budget feasibility.');
  if (currentIdea.status !== 'CFO_REVIEW' || currentIdea.current_owner_role !== 'CFO') {
    throw new Error('Step 4 failed');
  }
});

// 3.7 Security Guard: CGO cannot approve financial budgets
runTest('Security Guard: CGO forbidden from CFO_REVIEW approval (403)', () => {
  let blocked = false;
  try {
    simulateTransition('APPROVED', cgo, 'CGO attempt CFO approval');
  } catch (err) {
    blocked = true;
  }
  if (!blocked) throw new Error('Security failure: CGO signed off on CFO approval!');
});

// 3.8 CFO_REVIEW -> APPROVED (CFO Financial Signoff)
runTest('Pipeline Step 5: CFO validates ROI and grants formal APPROVED signoff', () => {
  simulateTransition('APPROVED', cfo, 'Financial ROI modeling validated. Budget approved.');
  if (currentIdea.status !== 'APPROVED') {
    throw new Error('Step 5 failed');
  }
});

// 3.9 APPROVED -> DEVELOPMENT_PLANNING -> IN_DEVELOPMENT -> TESTING -> PRODUCTION_REVIEW -> LAUNCHED -> BUSINESS_OPERATION
runTest('Pipeline Step 6: CEO commissions DEVELOPMENT_PLANNING (Assigned to Dev)', () => {
  simulateTransition('DEVELOPMENT_PLANNING', ceo, 'Commissioning sprint architecture.');
  if (currentIdea.status !== 'DEVELOPMENT_PLANNING' || currentIdea.current_owner_role !== 'DEVELOPER') {
    throw new Error('Step 6 failed');
  }
});

runTest('Pipeline Step 7: Developer starts IN_DEVELOPMENT', () => {
  simulateTransition('IN_DEVELOPMENT', dev, 'Active sprint implementation.');
  if (currentIdea.status !== 'IN_DEVELOPMENT') throw new Error('Step 7 failed');
});

runTest('Pipeline Step 8: Developer submits for TESTING', () => {
  simulateTransition('TESTING', dev, 'Agent evaluation benchmarks.');
  if (currentIdea.status !== 'TESTING') throw new Error('Step 8 failed');
});

runTest('Pipeline Step 9: Testing passes -> PRODUCTION_REVIEW', () => {
  simulateTransition('PRODUCTION_REVIEW', dev, 'Passed all compliance benchmarks.');
  if (currentIdea.status !== 'PRODUCTION_REVIEW') throw new Error('Step 9 failed');
});

runTest('Pipeline Step 10: CEO authorizes LAUNCHED', () => {
  simulateTransition('LAUNCHED', ceo, 'Live production deployment.');
  if (currentIdea.status !== 'LAUNCHED') throw new Error('Step 10 failed');
});

runTest('Pipeline Step 11: Transition to BUSINESS_OPERATION (Recurring Value)', () => {
  simulateTransition('BUSINESS_OPERATION', cgo, 'Entering commercial operations.');
  if (currentIdea.status !== 'BUSINESS_OPERATION') throw new Error('Step 11 failed');
});

runTest('Governance Audit: All 11 transition history logs recorded immutably', () => {
  if (history.length !== 11) throw new Error(`Expected 11 history entries, found ${history.length}`);
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
