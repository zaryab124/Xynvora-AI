// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — REALTIME EVENT BROADCASTER
// ─────────────────────────────────────────────────────────────

import { getSupabaseAdminClient } from './db';
import { logger } from './logger';

/**
 * Broadcast an event across a realtime channel
 */
export async function broadcastRealtimeEvent(
  channelName: string,
  event: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  try {
    const supabase = getSupabaseAdminClient();
    const channel = supabase.channel(channelName);

    await channel.send({
      type: 'broadcast',
      event,
      payload,
    });

    logger.debug(`Broadcast realtime event '${event}' on channel '${channelName}'`, payload, 'Realtime');
    return true;
  } catch (error) {
    logger.debug('Realtime broadcast failed (offline/unconfigured)', {
      channel: channelName,
      event,
      error: error instanceof Error ? error.message : String(error),
    }, 'Realtime');
    return false;
  }
}
