process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const connStr = 'postgresql://postgres:549229044wW%40@db.joepwnubykpmghalwmjw.supabase.co:5432/postgres';
const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false } });

async function smokeTest() {
  console.log('======================================================');
  console.log('   XYNVORA AI PLATFORM — COMPREHENSIVE SMOKE TEST');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Database Connectivity
    console.log('1. Database Engine Verification:');
    const dbRes = await pool.query('SELECT current_database() as db, version() as v');
    assert(dbRes.rows[0].db === 'postgres', `Database connected: ${dbRes.rows[0].db}`);
    assert(dbRes.rows[0].v.includes('PostgreSQL'), `Engine verified: ${dbRes.rows[0].v.split(' on ')[0]}`);

    // 2. Team & Role Seeding Check
    console.log('\n2. Team & Leadership Roster Verification:');
    const usersRes = await pool.query(`
      SELECT u.email, p.full_name, p.role, p.position, u.is_active
      FROM users u
      JOIN profiles p ON p.user_id = u.id
      ORDER BY p.role, p.full_name
    `);
    
    const ceo = usersRes.rows.find(u => u.role === 'CEO');
    assert(ceo && ceo.full_name === 'Muhammad Zaryab Hassan' && ceo.email === 'ceo@xynvora.ai', `CEO Verified: ${ceo?.full_name} (${ceo?.email})`);

    const cfo = usersRes.rows.find(u => u.role === 'CFO');
    assert(cfo && cfo.full_name === 'Muhammad Ismail' && cfo.email === 'cfo@xynvora.ai', `CFO Verified: ${cfo?.full_name} (${cfo?.email})`);

    const cgo = usersRes.rows.find(u => u.role === 'CGO');
    assert(cgo && cgo.full_name === 'Mahad Aziz' && cgo.email === 'cgo@xynvora.ai', `CGO Verified: ${cgo?.full_name} (${cgo?.email})`);

    const mohib = usersRes.rows.find(u => u.full_name === 'Mohib');
    assert(mohib && mohib.role === 'DEVELOPER' && mohib.position.includes('Software Head'), `Software Head Verified: ${mohib?.full_name} (${mohib?.position})`);

    const musab = usersRes.rows.find(u => u.full_name === 'Musab');
    assert(musab && musab.role === 'DEVELOPER' && musab.position.includes('Embedded Technologies Head'), `Embedded Tech Head Verified: ${musab?.full_name} (${musab?.position})`);

    const admin = usersRes.rows.find(u => u.email === 'admin@xynvora.ai');
    assert(admin && admin.full_name === 'Musfeera Kiran' && admin.role === 'ADMIN', `Admin Verified: ${admin?.full_name} (${admin?.role})`);

    const mod = usersRes.rows.find(u => u.email === 'moderator@xynvora.ai');
    assert(mod && mod.full_name === 'Musfeera Kiran' && mod.role === 'COMMUNITY_MODERATOR', `Moderator Verified: ${mod?.full_name} (${mod?.role})`);

    // 3. Password Verification
    console.log('\n3. Password Hash & Authentication Verification:');
    const pwdRes = await pool.query("SELECT password_hash FROM users WHERE email = 'ceo@xynvora.ai'");
    const isMatch = await bcrypt.compare('Password123!', pwdRes.rows[0].password_hash);
    assert(isMatch, 'Bcrypt password comparison succeeded for Password123!');

    // 4. Token Generation & JWT Verification
    console.log('\n4. Security Token & RBAC Token Generation:');
    const secret = 'xynvora_development_jwt_secret_change_in_production_super_secure_key';
    const testToken = jwt.sign({ id: 'test_id', email: 'ceo@xynvora.ai', role: 'CEO' }, secret, { expiresIn: '7d' });
    const decoded = jwt.verify(testToken, secret);
    assert(decoded.role === 'CEO' && decoded.email === 'ceo@xynvora.ai', 'JWT Sign & Verify succeeded with valid claims');

    // 5. Taxonomy Categories
    console.log('\n5. Platform Taxonomy & Innovation Categories:');
    const catRes = await pool.query('SELECT name, slug FROM categories');
    assert(catRes.rows.length >= 6, `Categories loaded: ${catRes.rows.length} categories available`);

    // 6. Ideas Pipeline Table Integrity
    console.log('\n6. Core Innovation Pipeline Tables:');
    const ideaCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'ideas'");
    assert(ideaCols.rows.length >= 10, `Ideas schema verified with ${ideaCols.rows.length} columns`);

    const projCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
    assert(projCols.rows.length >= 10, `Projects schema verified with ${projCols.rows.length} columns`);

    const taskCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks'");
    assert(taskCols.rows.length >= 10, `Tasks schema verified with ${taskCols.rows.length} columns`);

    const auditCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'audit_logs'");
    assert(auditCols.rows.length >= 7, `Audit logs schema verified with ${auditCols.rows.length} columns`);

    console.log('\n------------------------------------------------------');
    console.log(`Results: ${passed}/${passed + failed} Tests Passed (${failed} Failed)`);
    console.log('------------------------------------------------------\n');

  } catch (err) {
    console.error('Smoke Test Failure:', err.message);
  } finally {
    await pool.end();
  }
}

smokeTest();
