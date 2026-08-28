const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const cgoToken = jwt.sign(
  { sub: 'usr_cgo_test', userId: 'usr_cgo_test', email: 'cgo@xynvora.ai', role: 'CGO' },
  secret,
  { expiresIn: '1h' }
);

const ceoToken = jwt.sign(
  { sub: 'usr_ceo_test', userId: 'usr_ceo_test', email: 'ceo@xynvora.ai', role: 'CEO' },
  secret,
  { expiresIn: '1h' }
);

const cfoToken = jwt.sign(
  { sub: 'usr_cfo_test', userId: 'usr_cfo_test', email: 'cfo@xynvora.ai', role: 'CFO' },
  secret,
  { expiresIn: '1h' }
);

async function probePhase8() {
  const publicWebRoutes = [
    '/partnerships',
    '/partnerships/apply',
    '/knowledge',
    '/activities',
  ];

  const executiveWebRoutes = [
    { route: '/cgo/partnership-recommendations', token: cgoToken, name: 'CGO' },
    { route: '/cgo/activities', token: cgoToken, name: 'CGO' },
    { route: '/ceo/partners', token: ceoToken, name: 'CEO' },
    { route: '/ceo/activities', token: ceoToken, name: 'CEO' },
    { route: '/cfo/partnerships', token: cfoToken, name: 'CFO' },
  ];

  const apis = [
    { ep: '/api/partnerships', method: 'GET' },
    { ep: '/api/knowledge', method: 'GET' },
    { ep: '/api/activities', method: 'GET' },
  ];

  let passed = 0;
  let total = publicWebRoutes.length + executiveWebRoutes.length + apis.length;

  console.log('Probing Public Business Ecosystem Web Routes:');
  for (const r of publicWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3010${r}`);
      if (res.status === 200) {
        console.log(`  [200 OK (Public Web)] ${r}`);
        passed++;
      } else {
        console.log(`  [FAIL (Public Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (Public Web)] ${r}: ${err.message}`);
    }
  }

  console.log('\nProbing Executive Portal Web Routes:');
  for (const item of executiveWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3010${item.route}`, {
        headers: { Cookie: `xynvora_token=${item.token}` },
      });
      if (res.status === 200) {
        console.log(`  [200 OK (${item.name} Web)] ${item.route}`);
        passed++;
      } else {
        console.log(`  [FAIL (${item.name} Web)] ${item.route}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (${item.name} Web)] ${item.route}: ${err.message}`);
    }
  }

  console.log('\nProbing Ecosystem APIs:');
  for (const item of apis) {
    try {
      const res = await fetch(`http://localhost:3010${item.ep}`);
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (API)] ${item.ep}`);
        passed++;
      } else {
        console.log(`  [FAIL (API)] ${item.ep}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (API)] ${item.ep}: ${err.message}`);
    }
  }

  console.log(`\nPhase 8 Live Probes: ${passed}/${total} Passed.`);
}

probePhase8();
