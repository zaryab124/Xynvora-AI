// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — STRUCTURED LOGGING UTILITY
// ─────────────────────────────────────────────────────────────

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: Error | unknown;
  timestamp: string;
}

const REDACTED_KEYS = ['password', 'token', 'jwt_secret', 'secret', 'api_key', 'authorization', 'bearer'];

function sanitize(obj: unknown, depth = 0): unknown {
  if (depth > 5 || obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (REDACTED_KEYS.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = sanitize(value, depth + 1);
    }
  }
  return sanitized;
}

class Logger {
  private isProd = process.env.NODE_ENV === 'production';

  private format(payload: LogPayload): void {
    const sanitizedData = payload.data ? sanitize(payload.data) : undefined;
    const errorDetails =
      payload.error instanceof Error
        ? { message: payload.error.message, stack: this.isProd ? undefined : payload.error.stack }
        : payload.error;

    if (this.isProd) {
      console.log(
        JSON.stringify({
          ...payload,
          data: sanitizedData,
          error: errorDetails,
        })
      );
    } else {
      const prefix = `[${payload.timestamp}] [${payload.level}]${payload.context ? ` [${payload.context}]` : ''}`;
      if (payload.level === 'ERROR') {
        console.error(prefix, payload.message, sanitizedData || '', errorDetails || '');
      } else if (payload.level === 'WARN') {
        console.warn(prefix, payload.message, sanitizedData || '');
      } else {
        console.log(prefix, payload.message, sanitizedData || '');
      }
    }
  }

  debug(message: string, data?: Record<string, unknown>, context?: string): void {
    if (!this.isProd) {
      this.format({ level: 'DEBUG', message, data, context, timestamp: new Date().toISOString() });
    }
  }

  info(message: string, data?: Record<string, unknown>, context?: string): void {
    this.format({ level: 'INFO', message, data, context, timestamp: new Date().toISOString() });
  }

  warn(message: string, data?: Record<string, unknown>, context?: string): void {
    this.format({ level: 'WARN', message, data, context, timestamp: new Date().toISOString() });
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>, context?: string): void {
    this.format({ level: 'ERROR', message, error, data, context, timestamp: new Date().toISOString() });
  }
}

export const logger = new Logger();
