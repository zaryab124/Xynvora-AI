// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — AUDIT LOGGING UTILITY
// ─────────────────────────────────────────────────────────────

import { query } from './db';
import { logger } from './logger';
import { AuditLogInput } from './types';

/**
 * Record an audit log event in the database and server logs
 */
export async function auditLog(input: AuditLogInput): Promise<string> {
  const { userId, action, entity, entityId, details, ipAddress, userAgent } = input;

  logger.info(`[AUDIT] ${action} on ${entity}${entityId ? ` (${entityId})` : ''}`, {
    userId,
    action,
    entity,
    entityId,
    ipAddress,
  }, 'Audit');

  try {
    const res = await query<{ id: string }>(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        userId || null,
        action,
        entity,
        entityId || null,
        details ? JSON.stringify(details) : '{}',
        ipAddress || null,
        userAgent || null,
      ]
    );

    return res.rows[0]?.id || 'logged';
  } catch (error) {
    logger.warn('Failed to persist audit log to database', {
      error: error instanceof Error ? error.message : String(error),
      action,
      entity,
    }, 'Audit');
    return 'fallback-logged';
  }
}
