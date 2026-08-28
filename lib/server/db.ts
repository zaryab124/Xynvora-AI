// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — POSTGRESQL & SUPABASE DATABASE CLIENT
// ─────────────────────────────────────────────────────────────

import { Pool, QueryResult, QueryResultRow } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

// ─── Global Pool Cache for Serverless / Next.js Fast-Refresh ─
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var _supabaseAdmin: SupabaseClient | undefined;
}

/**
 * Resolve PostgreSQL connection string from environment
 * Supports standard DATABASE_URL, Vercel Supabase integration, and Neon/Postgres variables
 */
function getConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

/**
 * Determine if SSL should be enforced for PostgreSQL connection
 */
function getSslConfig(connectionString?: string) {
  if (!connectionString) return false;
  const requiresSsl =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1' ||
    connectionString.includes('supabase.co') ||
    connectionString.includes('sslmode=require') ||
    connectionString.includes('pooler.supabase.com');

  return requiresSsl ? { rejectUnauthorized: false } : false;
}

export function getPostgresPool(): Pool {
  if (!globalThis._pgPool) {
    let connectionString = getConnectionString();
    const isSsl = getSslConfig(connectionString);

    // If custom SSL handling is enabled, strip sslmode param from URI to avoid pg driver certificate collision
    if (connectionString && isSsl) {
      connectionString = connectionString
        .replace(/[?&]sslmode=[^&]+/gi, '')
        .replace(/[?&]ssl=[^&]+/gi, '');
      if (connectionString.endsWith('?') || connectionString.endsWith('&')) {
        connectionString = connectionString.slice(0, -1);
      }
    }

    const maxConnections = parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '10', 10);
    const idleTimeoutMillis = parseInt(process.env.POSTGRES_IDLE_TIMEOUT_MS || '20000', 10);

    globalThis._pgPool = new Pool({
      connectionString,
      max: maxConnections,
      idleTimeoutMillis,
      connectionTimeoutMillis: 10000,
      ssl: isSsl ? { rejectUnauthorized: false } : false,
    });

    globalThis._pgPool.on('error', (err) => {
      logger.error('Unexpected error on idle PostgreSQL client', err, undefined, 'Database');
    });
  }
  return globalThis._pgPool;
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
    // If direct PG fails, attempt Supabase client ping if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project.supabase.co')) {
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
      } catch {
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

/**
 * Get Supabase Admin Client (Service Role for Server-Side Operations)
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!globalThis._supabaseAdmin) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      'https://your-project.supabase.co';
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'dummy-key-for-build';

    globalThis._supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return globalThis._supabaseAdmin;
}
