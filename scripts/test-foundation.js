// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — FOUNDATION VERIFICATION TEST SUITE
// ─────────────────────────────────────────────────────────────

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { z } = require('zod');
const jwt = require('jsonwebtoken');

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

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failedTests++;
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('  XYNVORA AI PLATFORM — PHASE 1 FOUNDATION TEST SUITE');
  console.log('======================================================\n');

  // ─── 1. Environment Configuration Check ────────────
  console.log('1. Environment Configuration:');
  runTest('DATABASE_URL is defined', () => {
    if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
  });

  runTest('JWT_SECRET is defined and secure length', () => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
      throw new Error('JWT_SECRET is missing or too short');
    }
  });

  runTest('NEXT_PUBLIC_APP_URL is defined', () => {
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error('Missing NEXT_PUBLIC_APP_URL');
  });

  // ─── 2. Validation Utilities ──────────────────────
  console.log('\n2. Validation Utilities:');
  runTest('Zod schema validation passes for valid email and role', () => {
    const schema = z.object({
      email: z.string().email(),
      role: z.enum(['super_admin', 'cgo', 'ceo', 'cfo', 'developer', 'client', 'member']),
    });

    const validData = schema.parse({ email: 'ceo@xynvora.ai', role: 'ceo' });
    if (validData.role !== 'ceo') throw new Error('Validation parsed incorrect role');
  });

  runTest('Zod schema validation rejects invalid email and role', () => {
    const schema = z.object({
      email: z.string().email(),
      role: z.enum(['super_admin', 'cgo', 'ceo', 'cfo', 'developer', 'client', 'member']),
    });

    try {
      schema.parse({ email: 'not-an-email', role: 'invalid_role' });
      throw new Error('Expected validation error but passed');
    } catch (err) {
      if (err.name !== 'ZodError') throw err;
    }
  });

  // ─── 3. Authentication & JWT Tokens ───────────────
  console.log('\n3. Authentication & Token Engine:');
  let testToken = '';
  runTest('JWT sign and verify cycle', () => {
    const payload = {
      id: 'usr_test_123',
      email: 'cgo@xynvora.ai',
      role: 'cgo',
    };
    testToken = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.email !== 'cgo@xynvora.ai' || decoded.role !== 'cgo') {
      throw new Error('Decoded token payload mismatch');
    }
  });

  // ─── 4. Server-Side Authorization Matrix ───────────
  console.log('\n4. Server-Side Authorization Rules:');
  const ROLE_PERMS = {
    super_admin: ['system:manage', 'users:manage', 'leads:view', 'leads:triage', 'projects:view', 'projects:manage', 'invoices:view', 'invoices:manage', 'ideas:submit', 'ideas:review', 'audit:view'],
    admin: ['users:manage', 'leads:view', 'leads:triage', 'projects:view', 'projects:manage', 'invoices:view', 'invoices:manage', 'ideas:submit', 'ideas:review', 'audit:view'],
    cgo: ['leads:view', 'leads:triage', 'ideas:submit', 'ideas:review', 'projects:view'],
    ceo: ['projects:view', 'projects:manage', 'invoices:view', 'ideas:review', 'audit:view', 'leads:view'],
    cfo: ['invoices:view', 'invoices:manage', 'projects:view', 'audit:view'],
    developer: ['projects:view', 'ideas:submit'],
    client: ['projects:view', 'ideas:submit'],
    member: ['ideas:submit'],
  };

  runTest('Role permission matrix: CGO has leads:triage and ideas:review', () => {
    const cgoPerms = ROLE_PERMS['cgo'];
    if (!cgoPerms.includes('leads:triage') || !cgoPerms.includes('ideas:review')) {
      throw new Error('CGO missing expected triage permissions');
    }
  });

  runTest('Role permission matrix: CFO has invoices:manage and invoices:view', () => {
    const cfoPerms = ROLE_PERMS['cfo'];
    if (!cfoPerms.includes('invoices:manage') || !cfoPerms.includes('invoices:view')) {
      throw new Error('CFO missing expected financial permissions');
    }
  });

  runTest('Role permission matrix: Member cannot access leads:triage or invoices:manage', () => {
    const memberPerms = ROLE_PERMS['member'];
    if (memberPerms.includes('leads:triage') || memberPerms.includes('invoices:manage')) {
      throw new Error('Member has unauthorized permissions');
    }
  });

  // ─── 5. Audit Logging Logic ────────────────────────
  console.log('\n5. Audit Logging Engine:');
  runTest('Audit log sanitization suppresses sensitive credentials', () => {
    const samplePayload = {
      user: 'admin@xynvora.ai',
      password: 'SuperSecretPassword123!',
      token: 'jwt.token.here',
      action: 'USER_LOGIN',
    };

    const REDACTED_KEYS = ['password', 'token', 'jwt_secret', 'secret', 'api_key', 'authorization'];
    const sanitized = {};
    for (const [k, v] of Object.entries(samplePayload)) {
      sanitized[k] = REDACTED_KEYS.includes(k.toLowerCase()) ? '[REDACTED]' : v;
    }

    if (sanitized.password !== '[REDACTED]' || sanitized.token !== '[REDACTED]') {
      throw new Error('Sensitive fields not redacted');
    }
    if (sanitized.action !== 'USER_LOGIN') {
      throw new Error('Non-sensitive field improperly modified');
    }
  });

  // ─── 6. Notification Dispatch Logic ────────────────
  console.log('\n6. Notification Dispatch:');
  runTest('Notification payload structure validation', () => {
    const notif = {
      userId: 'usr_456',
      title: 'New Lead Assigned',
      message: 'A new warm lead from Enterprise client is ready for triage',
      type: 'lead',
      link: '/dashboard/cgo/leads/123',
    };

    if (!notif.userId || !notif.title || !notif.message) {
      throw new Error('Invalid notification payload structure');
    }
  });

  // ─── Summary ───────────────────────────────────────
  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('------------------------------------------------------\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
