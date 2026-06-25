import { createValidationError } from "./api-errors";

export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") {
    throw createValidationError("input", "Invalid string input");
  }
  
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw createValidationError("input", "String cannot be empty");
  }
  
  if (trimmed.length > maxLength) {
    throw createValidationError("input", `String exceeds maximum length of ${maxLength}`);
  }
  
  // Remove potentially dangerous characters
  return trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // Remove script tags
}

export function validateUrl(input: unknown, allowedProtocols: string[] = ["http", "https"]): string {
  if (typeof input !== "string") {
    throw createValidationError("url", "Invalid URL input");
  }
  
  try {
    const url = new URL(input.trim());
    
    if (!allowedProtocols.includes(url.protocol.replace(":", ""))) {
      throw createValidationError("url", `URL protocol must be one of: ${allowedProtocols.join(", ")}`);
    }
    
    return url.toString();
  } catch {
    throw createValidationError("url", "Invalid URL format");
  }
}

export function validateVideoId(input: unknown): string {
  if (typeof input !== "string") {
    throw createValidationError("videoId", "Invalid video ID input");
  }
  
  const trimmed = input.trim();
  
  // CUID format validation (starts with 'c' followed by alphanumeric, min 21 chars)
  if (!/^c[a-z0-9]{20,}$/i.test(trimmed)) {
    throw createValidationError("videoId", "Invalid video ID format");
  }
  
  return trimmed;
}

export function validatePaginationParams(limit?: unknown, cursor?: unknown): { limit: number; cursor?: string } {
  const parsedLimit = limit ? Number(limit) : 50;
  
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw createValidationError("limit", "Limit must be between 1 and 100");
  }
  
  let validatedCursor: string | undefined;
  if (cursor && typeof cursor === "string") {
    validatedCursor = validateVideoId(cursor);
  }
  
  return { limit: parsedLimit, cursor: validatedCursor };
}

export function validateSearchQuery(input: unknown): string {
  if (typeof input !== "string") {
    throw createValidationError("query", "Invalid search query");
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length > 120) {
    throw createValidationError("query", "Search query exceeds maximum length of 120 characters");
  }
  
  // Allow alphanumeric, spaces, and common punctuation
  if (!/^[a-zA-Z0-9\s\-_.,!?@#$%&*()]+$/.test(trimmed)) {
    throw createValidationError("query", "Search query contains invalid characters");
  }
  
  return trimmed;
}

export function validateBoolean(input: unknown, fieldName: string): boolean {
  if (typeof input === "boolean") {
    return input;
  }
  
  if (input === "true" || input === "1") return true;
  if (input === "false" || input === "0") return false;
  
  throw createValidationError(fieldName, "Must be a boolean value");
}

export function validateEnum<T extends string>(input: unknown, values: readonly T[], fieldName: string): T {
  if (typeof input !== "string") {
    throw createValidationError(fieldName, "Invalid enum value");
  }
  
  if (!values.includes(input as T)) {
    throw createValidationError(fieldName, `Must be one of: ${values.join(", ")}`);
  }
  
  return input as T;
}
