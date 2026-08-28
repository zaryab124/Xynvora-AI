// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — NOTIFICATION DISPATCH UTILITY
// ─────────────────────────────────────────────────────────────

import { query } from './db';
import { logger } from './logger';
import { broadcastRealtimeEvent } from './realtime';
import { NotificationInput } from './types';

/**
 * Create a new user notification and broadcast via realtime
 */
export async function createNotification(input: NotificationInput): Promise<string> {
  const { userId, title, message, type = 'info', link } = input;

  logger.info(`[NOTIFICATION] To User ${userId}: ${title}`, { type, link }, 'Notification');

  let notificationId = 'notif_' + Date.now();

  try {
    const res = await query<{ id: string }>(
      `INSERT INTO notifications (user_id, title, message, type, link, is_read)
       VALUES ($1, $2, $3, $4, $5, false)
       RETURNING id`,
      [userId, title, message, type, link || null]
    );

    if (res.rows[0]?.id) {
      notificationId = res.rows[0].id;
    }
  } catch (error) {
    logger.warn('Failed to insert notification into database', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      title,
    }, 'Notification');
  }

  // Non-blocking realtime broadcast
  broadcastRealtimeEvent(`user_notifications:${userId}`, 'new_notification', {
    id: notificationId,
    userId,
    title,
    message,
    type,
    link,
    createdAt: new Date().toISOString(),
  }).catch((err) => {
    logger.debug('Realtime notification broadcast skipped/failed', { error: String(err) }, 'Notification');
  });

  return notificationId;
}
