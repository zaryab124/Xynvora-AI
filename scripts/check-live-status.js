process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const connStr = 'postgresql://postgres.joepwnubykpmghalwmjw:549229044wW%40@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function check() {
  console.log('Testing live connection to Supabase PostgreSQL (Tokyo)...');
  try {
    const res = await pool.query('SELECT NOW() as time, current_database() as db, version() as version');
    console.log('✅ DATABASE STATUS: ONLINE & CONNECTED');
    console.log('  Database Name:', res.rows[0].db);
    console.log('  Server Timestamp:', res.rows[0].time);
    console.log('  PostgreSQL Engine:', res.rows[0].version.split(' on ')[0]);
    
    // Check tables
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log(`\n✅ INITIALIZED DATABASE TABLES (${tables.rows.length} Total):`);
    tables.rows.forEach(r => console.log('   •', r.table_name));

    // Check categories seed
    const catCheck = tables.rows.find(r => r.table_name === 'categories');
    if (catCheck) {
      const cats = await pool.query('SELECT name, slug FROM categories LIMIT 10');
      console.log(`\n✅ SEEDED TAXONOMY CATEGORIES (${cats.rows.length} Total):`);
      cats.rows.forEach(c => console.log(`   [${c.slug}] -> ${c.name}`));
    }
  } catch (err) {
    console.error('❌ Connection Issue:', err.message);
  } finally {
    await pool.end();
  }
}

check();
