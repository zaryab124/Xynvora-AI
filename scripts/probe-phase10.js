const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const cgoToken = jwt.sign({ sub: 'usr_cgo', userId: 'usr_cgo', email: 'cgo@xynvora.ai', role: 'CGO' }, secret, { expiresIn: '1h' });
const ceoToken = jwt.sign({ sub: 'usr_ceo', userId: 'usr_ceo', email: 'ceo@xynvora.ai', role: 'CEO' }, secret, { expiresIn: '1h' });
const cfoToken = jwt.sign({ sub: 'usr_cfo', userId: 'usr_cfo', email: 'cfo@xynvora.ai', role: 'CFO' }, secret, { expiresIn: '1h' });
const devToken = jwt.sign({ sub: 'usr_dev', userId: 'usr_dev', email: 'dev@xynvora.ai', role: 'DEVELOPER' }, secret, { expiresIn: '1h' });
const adminToken = jwt.sign({ sub: 'usr_admin', userId: 'usr_admin', email: 'admin@xynvora.ai', role: 'ADMIN' }, secret, { expiresIn: '1h' });

async function probePhase10() {
  const probes = [
    { ep: '/api/analytics/cgo', token: cgoToken, name: 'CGO Analytics' },
    { ep: '/api/analytics/ceo', token: ceoToken, name: 'CEO Analytics' },
    { ep: '/api/analytics/cfo', token: cfoToken, name: 'CFO Analytics' },
    { ep: '/api/analytics/developer', token: devToken, name: 'Developer Analytics' },
    { ep: '/api/analytics/admin', token: adminToken, name: 'Admin Analytics' },
  ];

  let passed = 0;
  let total = probes.length;

  console.log('Probing Role-Specific Analytics Endpoints:');
  for (const item of probes) {
    try {
      const res = await fetch(`http://localhost:3010${item.ep}`, {
        headers: { Authorization: `Bearer ${item.token}` },
      });
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (${item.name})] ${item.ep}`);
        passed++;
      } else {
        console.log(`  [FAIL (${item.name})] ${item.ep}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (${item.name})] ${item.ep}: ${err.message}`);
    }
  }

  console.log(`\nPhase 10 Live Probes: ${passed}/${total} Passed.`);
}

probePhase10();
