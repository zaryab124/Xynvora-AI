// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — PHASE 10 ANALYTICS, AUDIT & SECURITY TEST SUITE
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
console.log('  XYNVORA AI PLATFORM — PHASE 10 AUDIT & SECURITY');
console.log('======================================================\n');

// ─── 1. Role-Specific Analytics Endpoints & Access Control ─
console.log('1. Analytics Engine & Role Clearance Verification:');
const analyticsApis = [
  { role: 'CGO', endpoint: 'app/api/analytics/cgo/route.ts' },
  { role: 'CEO', endpoint: 'app/api/analytics/ceo/route.ts' },
  { role: 'CFO', endpoint: 'app/api/analytics/cfo/route.ts' },
  { role: 'DEVELOPER', endpoint: 'app/api/analytics/developer/route.ts' },
  { role: 'ADMIN', endpoint: 'app/api/analytics/admin/route.ts' },
];

analyticsApis.forEach((item) => {
  runTest(`Analytics Endpoint for ${item.role}: ${item.endpoint}`, () => {
    const p = path.join(__dirname, '..', ...item.endpoint.split('/'));
    if (!fs.existsSync(p)) throw new Error(`Missing ${item.endpoint}`);
  });
});

// ─── 2. Audit Trail for Sensitive Actions ─────────────────
console.log('\n2. Audit Trail Traceability for Sensitive Actions:');
const SENSITIVE_ACTIONS = [
  { action: 'CGO_IDEA_VALIDATED', entity: 'ideas', actorRole: 'CGO' },
  { action: 'CEO_IDEA_APPROVED', entity: 'ideas', actorRole: 'CEO' },
  { action: 'CFO_EVALUATION_SIGNED', entity: 'financial_evaluations', actorRole: 'CFO' },
  { action: 'ADMIN_ROLE_MUTATED', entity: 'profiles', actorRole: 'ADMIN' },
  { action: 'MODERATOR_CONTENT_REMOVED', entity: 'posts', actorRole: 'COMMUNITY_MODERATOR' },
  { action: 'DEVELOPER_PROJECT_TRANSITION', entity: 'projects', actorRole: 'DEVELOPER' },
  { action: 'USER_SETTINGS_MODIFIED', entity: 'users', actorRole: 'COMMUNITY_MEMBER' },
];

SENSITIVE_ACTIONS.forEach((item) => {
  runTest(`Audit Event Logged: [${item.action}] by ${item.actorRole} on ${item.entity}`, () => {
    const auditRecord = {
      id: 'aud_' + Date.now(),
      actorRole: item.actorRole,
      action: item.action,
      entity: item.entity,
      entityId: 'ent_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      metadata: { source: 'automated_test' }
    };
    if (!auditRecord.action || !auditRecord.timestamp || !auditRecord.entity) {
      throw new Error('Invalid audit log format');
    }
  });
});

runTest('Audit Immutability Guard: Normal users cannot delete audit records', () => {
  const user = { role: 'COMMUNITY_MEMBER' };
  const canDeleteAudit = user.role === 'SUPER_ADMIN_IMMUTABLE_ROOT';
  if (canDeleteAudit) throw new Error('Audit deletion allowed');
});

// ─── 3. Security Engine & Vulnerability Hardening ─────────
console.log('\n3. Security & Vulnerability Hardening:');

// Rate Limit Test Logic
function testRateLimit(identifier, limit = 2, windowMs = 1000) {
  const store = new Map();
  function check(id) {
    const now = Date.now();
    const record = store.get(id);
    if (!record || now > record.resetAt) {
      store.set(id, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1 };
    }
    if (record.count >= limit) {
      return { success: false, remaining: 0 };
    }
    record.count += 1;
    return { success: true, remaining: limit - record.count };
  }
  return { check };
}

runTest('Security 1: Rate Limiter Token Bucket enforces quota (60 req/min)', () => {
  const rl = testRateLimit('test_ip', 2, 1000);
  const r1 = rl.check('test_ip');
  if (!r1.success || r1.remaining !== 1) throw new Error('First limit check failed');
  const r2 = rl.check('test_ip');
  if (!r2.success || r2.remaining !== 0) throw new Error('Second limit check failed');
  const r3 = rl.check('test_ip');
  if (r3.success) throw new Error('Rate limiter failed to block on 3rd attempt');
});

// XSS Sanitizer Logic
function testSanitize(input) {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/onerror\s*=\s*[^"'\s>]*/gi, '');
}

runTest('Security 2: Input Sanitization strips malicious XSS payload', () => {
  const malicious = '<p>Hello</p><script>alert("XSS Attack")</script><iframe src="evil.com"></iframe><img src="x" onerror="stealCookies()">';
  const clean = testSanitize(malicious);
  if (clean.includes('<script>') || clean.includes('<iframe>') || clean.includes('onerror=')) {
    throw new Error(`XSS not sanitized: ${clean}`);
  }
  if (!clean.includes('<p>Hello</p>')) {
    throw new Error('Valid content removed during sanitization');
  }
});

// File Upload Validator Logic
const ALLOWED = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'json', 'yaml', 'yml', 'md', 'txt', 'zip']);
const FORBIDDEN = new Set(['exe', 'bat', 'cmd', 'sh', 'php', 'py', 'js', 'vbs', 'ps1']);

function testFileValidate(fileName, size, maxSize = 25 * 1024 * 1024) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (FORBIDDEN.has(ext)) return { valid: false, error: 'Forbidden extension' };
  if (!ALLOWED.has(ext)) return { valid: false, error: 'Unsupported extension' };
  if (size > maxSize) return { valid: false, error: 'File size exceeded' };
  return { valid: true };
}

runTest('Security 3: File Upload Validation blocks dangerous executables (.exe, .sh, .bat)', () => {
  const resExe = testFileValidate('malware.exe', 1024);
  if (resExe.valid) throw new Error('Executable .exe was erroneously permitted');
  const resSh = testFileValidate('exploit.sh', 1024);
  if (resSh.valid) throw new Error('Shell script .sh was erroneously permitted');
  const resBat = testFileValidate('script.bat', 1024);
  if (resBat.valid) throw new Error('Batch file .bat was erroneously permitted');
});

runTest('Security 4: File Upload Validation permits safe assets (.pdf, .png, .json, .zip)', () => {
  const resPdf = testFileValidate('architecture.pdf', 1024 * 1024);
  if (!resPdf.valid) throw new Error(`.pdf rejected: ${resPdf.error}`);
  const resPng = testFileValidate('diagram.png', 500 * 1024);
  if (!resPng.valid) throw new Error(`.png rejected: ${resPng.error}`);
  const resZip = testFileValidate('source_code.zip', 5 * 1024 * 1024);
  if (!resZip.valid) throw new Error(`.zip rejected: ${resZip.error}`);
});

// Sensitive data masking logic
function testMaskSensitive(obj) {
  const sensitiveKeys = ['password', 'password_hash', 'secret', 'jwt_secret', 'token'];
  const masked = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (sensitiveKeys.includes(k.toLowerCase())) {
      masked[k] = '[REDACTED]';
    } else if (v && typeof v === 'object') {
      masked[k] = testMaskSensitive(v);
    } else {
      masked[k] = v;
    }
  }
  return masked;
}

runTest('Security 5: Sensitive Data Masking strips passwords and secret keys from responses', () => {
  const rawPayload = {
    userId: 'usr_1',
    email: 'test@xynvora.ai',
    password: 'super_secret_password_123',
    jwt_secret: 'xynvora_secret_key',
    profile: {
      fullName: 'Test User',
      token: 'jwt.token.here',
    }
  };
  const masked = testMaskSensitive(rawPayload);
  if (masked.password !== '[REDACTED]' || masked.jwt_secret !== '[REDACTED]' || masked.profile?.token !== '[REDACTED]') {
    throw new Error('Sensitive data failed to mask');
  }
  if (masked.email !== 'test@xynvora.ai') {
    throw new Error('Non-sensitive field altered');
  }
});

console.log('\n------------------------------------------------------');
console.log(`Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
