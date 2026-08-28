// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — SECURITY & SANITIZATION ENGINE
// ─────────────────────────────────────────────────────────────

/**
 * Sanitize string inputs to prevent Stored & Reflected XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/onerror\s*=\s*[^"'\s>]*/gi, '')
    .replace(/onload\s*=\s*[^"'\s>]*/gi, '')
    .replace(/onclick\s*=\s*[^"'\s>]*/gi, '');
}

/**
 * Permitted file extensions for safe uploads
 */
const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'json', 'yaml', 'yml', 'md', 'txt', 'zip', 'tar', 'gz'
]);

const FORBIDDEN_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'php', 'phtml', 'py', 'js', 'vbs', 'ps1', 'jar', 'msi', 'bin', 'dll'
]);

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file uploads against extension and size limits
 */
export function validateFileUpload(fileName: string, sizeBytes: number, maxSizeBytes = 25 * 1024 * 1024): FileValidationResult {
  if (!fileName || typeof fileName !== 'string') {
    return { valid: false, error: 'Invalid file name' };
  }

  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Forbidden file executable extension: .${ext}` };
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Unsupported file extension: .${ext}` };
  }

  if (sizeBytes > maxSizeBytes) {
    return { valid: false, error: `File size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB limit` };
  }

  return { valid: true };
}

/**
 * Mask sensitive credentials from logs and API payloads
 */
export function maskSensitiveData<T extends Record<string, any>>(obj: T): Partial<T> {
  if (!obj || typeof obj !== 'object') return obj;
  const sensitiveKeys = ['password', 'password_hash', 'secret', 'jwt_secret', 'token', 'access_token', 'refresh_token'];
  const masked: any = Array.isArray(obj) ? [] : {};

  for (const [k, v] of Object.entries(obj)) {
    if (sensitiveKeys.includes(k.toLowerCase())) {
      masked[k] = '[REDACTED]';
    } else if (v && typeof v === 'object') {
      masked[k] = maskSensitiveData(v);
    } else {
      masked[k] = v;
    }
  }

  return masked;
}
