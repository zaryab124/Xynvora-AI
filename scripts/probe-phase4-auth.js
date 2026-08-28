const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const testToken = jwt.sign(
  {
    sub: 'usr_test_alpha',
    userId: 'usr_test_alpha',
    email: 'alpha@xynvora.ai',
    role: 'COMMUNITY_MEMBER',
  },
  secret,
  { expiresIn: '1h' }
);

async function probeAuthenticatedEndpoints() {
  const endpoints = [
    '/api/user/profile',
    '/api/user/dashboard',
    '/api/user/settings',
    '/api/user/block',
    '/api/notifications',
  ];

  let passed = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:3008${ep}`, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });
      const data = await res.json();
      if (res.status === 200 && data.success) {
        console.log(`  [200 OK (Auth)] ${ep}`);
        passed++;
      } else {
        console.log(`  [FAIL] ${ep}: status ${res.status}`, data);
      }
    } catch (err) {
      console.log(`  [FAIL] ${ep}:`, err.message);
    }
  }

  console.log(`\nAuthenticated Probes: ${passed}/${endpoints.length} Passed.`);
}

probeAuthenticatedEndpoints();
