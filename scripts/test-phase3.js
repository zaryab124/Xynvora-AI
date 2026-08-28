// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 3 VERIFICATION TEST SUITE
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
console.log('  XYNVORA AI PLATFORM — PHASE 3 WEBSITE & API TESTS');
console.log('======================================================\n');

// ─── 1. Design System Components ─────────────────────
console.log('1. Design System Components:');
const requiredUiComponents = [
  'Button.tsx',
  'Card.tsx',
  'Card3D.tsx',
  'GlowOrb.tsx',
  'SectionTitle.tsx',
  'StatusBadge.tsx',
  'Badge.tsx',
  'Input.tsx',
  'Textarea.tsx',
  'Select.tsx',
  'Modal.tsx',
  'Tabs.tsx',
  'Table.tsx',
  'Alert.tsx',
  'Skeleton.tsx',
  'EmptyState.tsx',
  'ErrorState.tsx',
  'Toast.tsx',
];

requiredUiComponents.forEach((comp) => {
  runTest(`UI Component: ${comp}`, () => {
    const compPath = path.join(__dirname, '..', 'components', 'ui', comp);
    if (!fs.existsSync(compPath)) throw new Error(`Missing ${comp}`);
  });
});

// ─── 2. Public Route Suite ───────────────────────────
console.log('\n2. Public Route Suite (17 Required Routes):');
const requiredRoutes = [
  { route: '/', file: 'app/page.tsx' },
  { route: '/about', file: 'app/about/page.tsx' },
  { route: '/community', file: 'app/community/page.tsx' },
  { route: '/ideas', file: 'app/ideas/page.tsx' },
  { route: '/ideas/[id]', file: 'app/ideas/[id]/page.tsx' },
  { route: '/projects', file: 'app/projects/page.tsx' },
  { route: '/projects/[id]', file: 'app/projects/[id]/page.tsx' },
  { route: '/business', file: 'app/business/page.tsx' },
  { route: '/business/[category]', file: 'app/business/[category]/page.tsx' },
  { route: '/knowledge', file: 'app/knowledge/page.tsx' },
  { route: '/activities', file: 'app/activities/page.tsx' },
  { route: '/members', file: 'app/members/page.tsx' },
  { route: '/members/[username]', file: 'app/members/[username]/page.tsx' },
  { route: '/partners', file: 'app/partners/page.tsx' },
  { route: '/contact', file: 'app/contact/page.tsx' },
  { route: '/login', file: 'app/login/page.tsx' },
  { route: '/register', file: 'app/register/page.tsx' },
];

requiredRoutes.forEach((r) => {
  runTest(`Public Route: ${r.route} (${r.file})`, () => {
    const p = path.join(__dirname, '..', ...r.file.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing route file for ${r.route}`);
  });
});

// ─── 3. Public API Data Layer Routes ─────────────────
console.log('\n3. Public API Layer Endpoints:');
const requiredApiRoutes = [
  'app/api/public/ideas/route.ts',
  'app/api/public/ideas/[id]/route.ts',
  'app/api/public/projects/route.ts',
  'app/api/public/projects/[id]/route.ts',
  'app/api/public/community/route.ts',
  'app/api/public/members/route.ts',
  'app/api/public/members/[username]/route.ts',
  'app/api/public/partners/route.ts',
  'app/api/public/contact/route.ts',
];

requiredApiRoutes.forEach((api) => {
  runTest(`API Route: /${api.replace('/route.ts', '')}`, () => {
    const p = path.join(__dirname, '..', ...api.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing API route ${api}`);
  });
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
