const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const secret = process.env.JWT_SECRET || 'xynvora-super-secret-jwt-token-key-change-in-production-min-32-chars';

const devToken = jwt.sign(
  {
    sub: 'usr_dev_test',
    userId: 'usr_dev_test',
    email: 'dev@xynvora.ai',
    role: 'DEVELOPER',
    full_name: 'Ahmed Khan',
  },
  secret,
  { expiresIn: '1h' }
);

async function probePhase7() {
  const devWebRoutes = [
    '/developer',
    '/developer/dashboard',
    '/developer/projects',
    '/developer/projects/proj_1',
    '/developer/tasks',
    '/developer/tasks/task_1',
    '/developer/milestones',
    '/developer/files',
    '/developer/team',
    '/developer/notifications',
  ];

  const devApiEndpoints = [
    '/api/developer/dashboard',
    '/api/developer/projects',
    '/api/developer/projects/proj_1',
    '/api/developer/tasks',
    '/api/developer/tasks/task_1',
    '/api/developer/milestones',
    '/api/developer/files',
    '/api/developer/team',
  ];

  let passed = 0;
  let total = devWebRoutes.length + devApiEndpoints.length;

  console.log('Probing Developer Web Routes:');
  for (const r of devWebRoutes) {
    try {
      const res = await fetch(`http://localhost:3010${r}`, {
        headers: { Cookie: `xynvora_token=${devToken}` },
      });
      if (res.status === 200) {
        console.log(`  [200 OK (Developer Web)] ${r}`);
        passed++;
      } else {
        console.log(`  [FAIL (Developer Web)] ${r}: Status ${res.status}`);
      }
    } catch (err) {
      console.log(`  [FAIL (Developer Web)] ${r}: ${err.message}`);
    }
  }

  console.log('\nProbing Developer API Endpoints:');
  for (const ep of devApiEndpoints) {
    try {
      const res = await fetch(`http://localhost:3010${ep}`, {
        headers: { Authorization: `Bearer ${devToken}` },
      });
      const json = await res.json();
      if (res.status === 200 && json.success) {
        console.log(`  [200 OK (Developer API)] ${ep}`);
        passed++;
      } else {
        console.log(`  [FAIL (Developer API)] ${ep}: Status ${res.status}`, json);
      }
    } catch (err) {
      console.log(`  [FAIL (Developer API)] ${ep}: ${err.message}`);
    }
  }

  console.log(`\nPhase 7 Live Probes: ${passed}/${total} Passed.`);
}

probePhase7();
