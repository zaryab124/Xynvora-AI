const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const cgoToken = jwt.sign(
  {
    sub: 'usr_cgo_test',
    userId: 'usr_cgo_test',
    email: 'cgo@xynvora.ai',
    role: 'CGO',
  },
  secret,
  { expiresIn: '1h' }
);

async function probePhase5() {
  const publicWebRoutes = [
    '/ideas',
    '/ideas/create',
    '/ideas/idea_1',
    '/ideas/idea_1/edit',
  ];

  const protectedCgoWebRoutes = [
    '/cgo',
    '/cgo/dashboard',
    '/cgo/ideas',
    '/cgo/ideas/idea_1',
    '/cgo/community',
    '/cgo/community/members',
    '/cgo/community/initiatives',
    '/cgo/growth',
    '/cgo/contributors',
    '/cgo/partnership-recommendations',
    '/cgo/developers',
    '/cgo/activities',
    '/cgo/notifications',
    '/cgo/audit-logs',
  ];

  const apiEndpoints = [
    '/api/ideas',
    '/api/ideas/idea_1',
    '/api/cgo/dashboard',
    '/api/cgo/growth',
    '/api/cgo/contributors',
    '/api/cgo/developers',
    '/api/cgo/audit-logs',
    '/api/cgo/community/members',
    '/api/cgo/community/initiatives',
    '/api/cgo/partnership-recommendations',
  ];

  let webPassed = 0;
  for (const r of publicWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3009${r}`);
      if (res.status === 200) {
        console.log(`  [200 OK (Public Web)] ${r}`);
        webPassed++;
      } else {
        console.log(`  [FAIL (Public Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (Public Web)] ${r}: ${err.message}`);
    }
  }

  for (const r of protectedCgoWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3009${r}`, {
        headers: {
          Cookie: `xynvora_token=${cgoToken}`,
        },
      });
      if (res.status === 200) {
        console.log(`  [200 OK (CGO Portal Web)] ${r}`);
        webPassed++;
      } else {
        console.log(`  [FAIL (CGO Portal Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (CGO Portal Web)] ${r}: ${err.message}`);
    }
  }

  let apiPassed = 0;
  for (const ep of apiEndpoints) {
    try {
      const res = await fetch(`http://localhost:3009${ep}`, {
        headers: {
          Authorization: `Bearer ${cgoToken}`,
        },
      });
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (API)] ${ep}`);
        apiPassed++;
      } else {
        console.log(`  [FAIL (API)] ${ep}: Status ${res.status}`, json);
      }
    } catch (err) {
      console.log(`  [FAIL (API)] ${ep}: ${err.message}`);
    }
  }

  const totalWeb = publicWebRoutes.length + protectedCgoWebRoutes.length;
  console.log(`\nPhase 5 Probes: Web (${webPassed}/${totalWeb}), API (${apiPassed}/${apiEndpoints.length}) Passed.`);
}

probePhase5();
