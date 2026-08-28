const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const ceoToken = jwt.sign(
  {
    sub: 'usr_ceo_test',
    userId: 'usr_ceo_test',
    email: 'ceo@xynvora.ai',
    role: 'CEO',
  },
  secret,
  { expiresIn: '1h' }
);

const cfoToken = jwt.sign(
  {
    sub: 'usr_cfo_test',
    userId: 'usr_cfo_test',
    email: 'cfo@xynvora.ai',
    role: 'CFO',
  },
  secret,
  { expiresIn: '1h' }
);

async function probePhase6() {
  const ceoWebRoutes = [
    '/ceo',
    '/ceo/dashboard',
    '/ceo/ideas',
    '/ceo/ideas/idea_1',
    '/ceo/approvals',
    '/ceo/projects',
    '/ceo/projects/create',
    '/ceo/projects/proj_1',
    '/ceo/developers',
    '/ceo/partners',
    '/ceo/activities',
    '/ceo/analytics',
    '/ceo/audit-logs',
  ];

  const cfoWebRoutes = [
    '/cfo',
    '/cfo/dashboard',
    '/cfo/reviews',
    '/cfo/reviews/idea_1',
    '/cfo/projects',
    '/cfo/projects/proj_1',
    '/cfo/budgets',
    '/cfo/partnerships',
    '/cfo/reports',
  ];

  const ceoApiEndpoints = [
    '/api/ceo/dashboard',
    '/api/ceo/ideas',
    '/api/ceo/approvals',
    '/api/ceo/projects',
    '/api/ceo/developers',
    '/api/ceo/partners',
    '/api/ceo/analytics',
    '/api/ceo/audit-logs',
  ];

  const cfoApiEndpoints = [
    '/api/cfo/dashboard',
    '/api/cfo/evaluations/idea_1',
    '/api/cfo/reviews',
    '/api/cfo/projects',
    '/api/cfo/budgets',
    '/api/cfo/partnerships',
    '/api/cfo/reports',
  ];

  let passed = 0;
  let total = ceoWebRoutes.length + cfoWebRoutes.length + ceoApiEndpoints.length + cfoApiEndpoints.length;

  for (const r of ceoWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3010${r}`, {
        headers: { Cookie: `xynvora_token=${ceoToken}` },
      });
      if (res.status === 200) {
        console.log(`  [200 OK (CEO Web)] ${r}`);
        passed++;
      } else {
        console.log(`  [FAIL (CEO Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (CEO Web)] ${r}: ${err.message}`);
    }
  }

  for (const r of cfoWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3010${r}`, {
        headers: { Cookie: `xynvora_token=${cfoToken}` },
      });
      if (res.status === 200) {
        console.log(`  [200 OK (CFO Web)] ${r}`);
        passed++;
      } else {
        console.log(`  [FAIL (CFO Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (CFO Web)] ${r}: ${err.message}`);
    }
  }

  for (const ep of ceoApiEndpoints) {
    try {
      const res = await fetch(`http://localhost:3010${ep}`, {
        headers: { Authorization: `Bearer ${ceoToken}` },
      });
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (CEO API)] ${ep}`);
        passed++;
      } else {
        console.log(`  [FAIL (CEO API)] ${ep}: Status ${res.status}`, json);
      }
    } catch (err) {
      console.log(`  [FAIL (CEO API)] ${ep}: ${err.message}`);
    }
  }

  for (const ep of cfoApiEndpoints) {
    try {
      const res = await fetch(`http://localhost:3010${ep}`, {
        headers: { Authorization: `Bearer ${cfoToken}` },
      });
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (CFO API)] ${ep}`);
        passed++;
      } else {
        console.log(`  [FAIL (CFO API)] ${ep}: Status ${res.status}`, json);
      }
    } catch (err) {
      console.log(`  [FAIL (CFO API)] ${ep}: ${err.message}`);
    }
  }

  console.log(`\nPhase 6 Live Probes: ${passed}/${total} Passed.`);
}

probePhase6();
