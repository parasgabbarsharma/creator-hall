export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  CONFLICT: 'CONFLICT',
} as const;

export function createValidationError(field: string, message: string) {
  return new ApiError(400, ErrorCodes.VALIDATION_ERROR, message, { field });
}

export function createNotFoundError(resource: string) {
  return new ApiError(404, ErrorCodes.NOT_FOUND, `${resource} not found`);
}

export function createConflictError(message: string) {
  return new ApiError(409, ErrorCodes.CONFLICT, message);
}

export function createRateLimitError() {
  return new ApiError(429, ErrorCodes.RATE_LIMIT_EXCEEDED, 'Too many requests');
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
