// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — HEALTH & DIAGNOSTICS ENDPOINT
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { apiSuccess } from '@/lib/server/api-response';
import { checkDatabaseConnection } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbHealth = await checkDatabaseConnection();

  const healthData = {
    status: 'healthy',
    platform: 'Xynvora AI Platform',
    phase: 'Phase 1: Foundation',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      connected: dbHealth.connected,
      provider: dbHealth.provider,
      latencyMs: dbHealth.latencyMs,
      ...(dbHealth.error && { error: dbHealth.error }),
    },
    services: {
      supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      storage: Boolean(process.env.SUPABASE_STORAGE_BUCKET),
      openai: Boolean(process.env.OPENAI_API_KEY),
      smtp: Boolean(process.env.SMTP_HOST),
    },
  };

  return apiSuccess(healthData);
}
