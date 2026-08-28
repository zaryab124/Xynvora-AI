process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const connStr = 'postgresql://postgres.joepwnubykpmghalwmjw:549229044wW%40@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

async function seedWithRetry(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[Attempt ${attempt}/${retries}] Connecting to Supabase...`);
    const pool = new Pool({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 30000
    });

    try {
      const passwordHash = await bcrypt.hash('Password123!', 10);

      const accounts = [
        { email: 'ceo@xynvora.ai', name: 'Muhammad Zaryab Hassan', role: 'CEO', position: 'Chief Executive Officer', company: 'Xynvora AI' },
        { email: 'cfo@xynvora.ai', name: 'Muhammad Ismail', role: 'CFO', position: 'Chief Financial Officer', company: 'Xynvora AI' },
        { email: 'cgo@xynvora.ai', name: 'Mahad Aziz', role: 'CGO', position: 'Chief Growth Officer', company: 'Xynvora AI' },
        { email: 'mohib@xynvora.ai', name: 'Mohib', role: 'DEVELOPER', position: 'Software Head & Lead Architect', company: 'Xynvora AI Squad' },
        { email: 'developer@xynvora.ai', name: 'Mohib', role: 'DEVELOPER', position: 'Software Head & Lead Architect', company: 'Xynvora AI Squad' },
        { email: 'musab@xynvora.ai', name: 'Musab', role: 'DEVELOPER', position: 'Embedded Technologies Head', company: 'Xynvora AI Squad' },
        { email: 'admin@xynvora.ai', name: 'Musfeera Kiran', role: 'ADMIN', position: 'Technical Administrator & Security Lead', company: 'Xynvora AI' },
        { email: 'moderator@xynvora.ai', name: 'Musfeera Kiran', role: 'COMMUNITY_MODERATOR', position: 'Moderator Lead & Trust & Safety', company: 'Xynvora AI' },
        { email: 'musfeera@xynvora.ai', name: 'Musfeera Kiran', role: 'ADMIN', position: 'Admin & Moderator Lead', company: 'Xynvora AI' },
        { email: 'member@xynvora.ai', name: 'Community Innovator', role: 'COMMUNITY_MEMBER', position: 'AI Research Fellow', company: 'Community' }
      ];

      for (const acc of accounts) {
        const userRes = await pool.query(
          `INSERT INTO users (email, password_hash, is_active, is_verified, created_at, updated_at)
           VALUES ($1, $2, true, true, NOW(), NOW())
           ON CONFLICT (email) DO UPDATE SET password_hash = $2, is_active = true
           RETURNING id`,
          [acc.email, passwordHash]
        );
        const userId = userRes.rows[0].id;

        await pool.query(
          `INSERT INTO profiles (user_id, full_name, role, position, company, reputation_score, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 500, NOW(), NOW())
           ON CONFLICT (user_id) DO UPDATE SET full_name = $2, role = $3, position = $4, company = $5`,
          [userId, acc.name, acc.role, acc.position, acc.company]
        );

        console.log(`✅ Seeded Account: [${acc.role}] ${acc.email} (${acc.name} — ${acc.position})`);
      }

      console.log('\nAll updated accounts successfully saved into Supabase!');
      await pool.end();
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} error:`, err.message);
      await pool.end();
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

seedWithRetry();
