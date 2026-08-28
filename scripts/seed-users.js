process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const connStr = 'postgresql://postgres.joepwnubykpmghalwmjw:549229044wW%40@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function seed() {
  console.log('Seeding official platform accounts into Supabase...');
  try {
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const accounts = [
      {
        email: 'ceo@xynvora.ai',
        name: 'Muhammad Zaryab Hassan',
        role: 'CEO',
        position: 'Chief Executive Officer',
        company: 'Xynvora AI'
      },
      {
        email: 'cfo@xynvora.ai',
        name: 'Muhammad Ismail',
        role: 'CFO',
        position: 'Chief Financial Officer',
        company: 'Xynvora AI'
      },
      {
        email: 'cgo@xynvora.ai',
        name: 'Mahad Aziz',
        role: 'CGO',
        position: 'Chief Growth Officer',
        company: 'Xynvora AI'
      },
      {
        email: 'developer@xynvora.ai',
        name: 'Ahmed Khan',
        role: 'DEVELOPER',
        position: 'Lead AI Engineer',
        company: 'Xynvora AI Squad'
      },
      {
        email: 'dev@xynvora.ai',
        name: 'Ahmed Khan',
        role: 'DEVELOPER',
        position: 'Lead AI Engineer',
        company: 'Xynvora AI Squad'
      },
      {
        email: 'moderator@xynvora.ai',
        name: 'Moderation Desk',
        role: 'COMMUNITY_MODERATOR',
        position: 'Community Trust & Safety',
        company: 'Xynvora AI'
      },
      {
        email: 'admin@xynvora.ai',
        name: 'Technical Administrator',
        role: 'ADMIN',
        position: 'Infrastructure & Security Admin',
        company: 'Xynvora AI'
      },
      {
        email: 'member@xynvora.ai',
        name: 'Community Innovator',
        role: 'COMMUNITY_MEMBER',
        position: 'AI Research Fellow',
        company: 'Community'
      }
    ];

    for (const acc of accounts) {
      // 1. Insert or update user
      const userRes = await pool.query(
        `INSERT INTO users (email, password_hash, is_active, is_verified, created_at, updated_at)
         VALUES ($1, $2, true, true, NOW(), NOW())
         ON CONFLICT (email) DO UPDATE SET password_hash = $2, is_active = true
         RETURNING id`,
        [acc.email, passwordHash]
      );
      const userId = userRes.rows[0].id;

      // 2. Insert or update profile
      await pool.query(
        `INSERT INTO profiles (user_id, full_name, role, position, company, reputation_score, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 500, NOW(), NOW())
         ON CONFLICT (user_id) DO UPDATE SET full_name = $2, role = $3, position = $4, company = $5`,
        [userId, acc.name, acc.role, acc.position, acc.company]
      );

      console.log(`✅ Seeded Account: [${acc.role}] ${acc.email} (${acc.name})`);
    }

    console.log('\nAll official accounts seeded successfully into Supabase!');
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
