// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — STORAGE INFRASTRUCTURE UTILITY
// ─────────────────────────────────────────────────────────────

import { getSupabaseAdminClient } from './db';
import { logger } from './logger';

export const DEFAULT_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'xynvora-assets';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  path: string,
  fileBody: Buffer | Uint8Array,
  contentType: string,
  bucket = DEFAULT_STORAGE_BUCKET
): Promise<{ path: string; publicUrl?: string; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) {
      logger.error('Storage upload failed', error, { bucket, path }, 'Storage');
      return { path, error: error.message };
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { path: data.path, publicUrl: urlData.publicUrl };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error('Storage upload exception', error, { bucket, path }, 'Storage');
    return { path, error: msg };
  }
}

/**
 * Get public URL for a file in a public bucket
 */
export function getPublicUrl(path: string, bucket = DEFAULT_STORAGE_BUCKET): string {
  const supabase = getSupabaseAdminClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Create a signed temporary URL for private assets (proposals, contracts, invoices)
 */
export async function createSignedUrl(
  path: string,
  expiresInSeconds = 3600,
  bucket = DEFAULT_STORAGE_BUCKET
): Promise<{ signedUrl?: string; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      return { error: error.message };
    }

    return { signedUrl: data.signedUrl };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}
