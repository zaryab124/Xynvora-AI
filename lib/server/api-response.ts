// ─────────────────────────────────────────────────────────────
// XYNVORA AI PLATFORM — STANDARDIZED API RESPONSE UTILITIES
// ─────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from './logger';
import { StandardApiResponse } from './types';

export function apiSuccess<T>(data: T, status = 200): NextResponse<StandardApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function apiError(
  message: string,
  status = 400,
  details?: unknown
): NextResponse<StandardApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input data', details?: unknown) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown, context = 'API'): NextResponse<StandardApiResponse<null>> {
  logger.error(`Error in ${context}`, error, undefined, context);

  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return apiError('Validation failed', 400, formattedErrors);
  }

  if (error instanceof AppError) {
    return apiError(error.message, error.statusCode, error.details);
  }

  if (error instanceof Error) {
    return apiError(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      500
    );
  }

  return apiError('An unexpected error occurred', 500);
}
