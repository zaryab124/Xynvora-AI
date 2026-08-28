const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const adminToken = jwt.sign(
  { sub: 'usr_admin_test', userId: 'usr_admin_test', email: 'admin@xynvora.ai', role: 'ADMIN' },
  secret,
  { expiresIn: '1h' }
);

async function probePhase9() {
  const adminWebRoutes = [
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/users/usr_1',
    '/admin/roles',
    '/admin/content',
    '/admin/categories',
    '/admin/reports',
    '/admin/reports/rep_1',
    '/admin/storage',
    '/admin/settings',
    '/admin/audit-logs',
  ];

  const adminApis = [
    '/api/admin/dashboard',
    '/api/admin/users',
    '/api/admin/users/usr_1',
    '/api/admin/roles',
    '/api/admin/content',
    '/api/admin/categories',
    '/api/admin/reports',
    '/api/admin/reports/rep_1',
    '/api/admin/storage',
    '/api/admin/settings',
    '/api/admin/audit-logs',
    '/api/notifications',
  ];

  let passed = 0;
  let total = adminWebRoutes.length + adminApis.length;

  console.log('Probing Admin Web Routes:');
  for (const r of adminWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3010${r}`, {
        headers: { Cookie: `xynvora_token=${adminToken}` },
      });
      if (res.status === 200) {
        console.log(`  [200 OK (Admin Web)] ${r}`);
        passed++;
      } else {
        console.log(`  [FAIL (Admin Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (Admin Web)] ${r}: ${err.message}`);
    }
  }

  console.log('\nProbing Admin & Centralized Notification APIs:');
  for (const ep of adminApis) {
    try {
      const res = await fetch(`http://localhost:3010${ep}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (Admin API)] ${ep}`);
        passed++;
      } else {
        console.log(`  [FAIL (Admin API)] ${ep}: Status ${res.status}`, json);
      }
    } catch (err) {
      console.log(`  [FAIL (Admin API)] ${ep}: ${err.message}`);
    }
  }

  console.log(`\nPhase 9 Live Probes: ${passed}/${total} Passed.`);
}

probePhase9();
