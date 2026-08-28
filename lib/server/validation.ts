// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — INPUT VALIDATION UTILITIES
// ─────────────────────────────────────────────────────────────

import { z, ZodSchema } from 'zod';
import { ValidationError } from './api-response';

/**
 * Synchronously validate input against a Zod schema
 */
export function validateInput<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formatted = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    throw new ValidationError('Validation failed', formatted);
  }
  return result.data;
}

/**
 * Asynchronously validate input against a Zod schema
 */
export async function validateInputAsync<T>(schema: ZodSchema<T>, data: unknown): Promise<T> {
  const result = await schema.safeParseAsync(data);
  if (!result.success) {
    const formatted = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    throw new ValidationError('Validation failed', formatted);
  }
  return result.data;
}

// ─── Common Reusable Validation Schemas ──────────────────────

export const emailSchema = z.string().email('Invalid email address').trim().toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long');

export const userRoleSchema = z.enum([
  'super_admin',
  'admin',
  'cgo',
  'ceo',
  'cfo',
  'manager',
  'employee',
  'developer',
  'client',
  'member',
]);

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
