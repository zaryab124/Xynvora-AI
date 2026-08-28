// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — POSTGRESQL & SUPABASE DATABASE CLIENT
// ─────────────────────────────────────────────────────────────

import { Pool, QueryResult, QueryResultRow } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

// ─── Direct PostgreSQL Connection Pool ───────────────────────
let pgPool: Pool | null = null;

export function getPostgresPool(): Pool {
  if (!pgPool) {
    const connectionString = process.env.DATABASE_URL;
    const maxConnections = parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20', 10);
    const idleTimeoutMillis = parseInt(process.env.POSTGRES_IDLE_TIMEOUT_MS || '30000', 10);

    pgPool = new Pool({
      connectionString,
      max: maxConnections,
      idleTimeoutMillis,
      connectionTimeoutMillis: 5000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    pgPool.on('error', (err) => {
      logger.error('Unexpected error on idle PostgreSQL client', err, undefined, 'Database');
    });
  }
  return pgPool;
}

/**
 * Execute a SQL query using the PostgreSQL connection pool
 */
export async function query<R extends QueryResultRow = QueryResultRow, I extends unknown[] = unknown[]>(
  text: string,
  params?: I
): Promise<QueryResult<R>> {
  const pool = getPostgresPool();
  const start = Date.now();
  try {
    const res = await pool.query<R>(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount }, 'Database');
    return res;
  } catch (error) {
    logger.error('Database query failed', error, { text }, 'Database');
    throw error;
  }
}

/**
 * Verify database health & connectivity
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  provider: 'postgresql' | 'supabase';
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const pool = getPostgresPool();
    await pool.query('SELECT 1 AS health_check');
    return {
      connected: true,
      provider: 'postgresql',
      latencyMs: Date.now() - start,
    };
  } catch (pgError: unknown) {
    // If direct PG fails, attempt Supabase ping if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      try {
        const client = getSupabaseAdminClient();
        const { error } = await client.from('system_settings').select('key').limit(1);
        if (!error) {
          return {
            connected: true,
            provider: 'supabase',
            latencyMs: Date.now() - start,
          };
        }
      } catch (sbError: unknown) {
        // Continue to error return
      }
    }

    const errMsg = pgError instanceof Error ? pgError.message : String(pgError);
    return {
      connected: false,
      provider: 'postgresql',
      latencyMs: Date.now() - start,
      error: errMsg,
    };
  }
}

// ─── Supabase Client Factory ─────────────────────────────────
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Get Supabase Admin Client (Service Role for Server-Side Operations)
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdmin;
}
