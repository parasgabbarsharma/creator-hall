import { NextResponse } from "next/server";
import { isApiError } from "./api-errors";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastSweep = Date.now();

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (process.env.TRUST_PROXY === "true" && forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host"); // DO NOT trust x-forwarded-host for CSRF

  if (!origin || !host) {
    throw new HttpError(403, "Invalid request origin");
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new HttpError(403, "Invalid request origin");
  }

  const expectedHost = process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host 
    : host;

  if (originHost !== expectedHost && originHost !== host) {
    throw new HttpError(403, "Invalid request origin");
  }
}

export async function rateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): Promise<void> {
  const now = Date.now();
  
  if (now - lastSweep > 60_000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetAt <= now) rateLimitStore.delete(k);
    }
    lastSweep = now;
  }

  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  if (existing.count >= options.limit) {
    throw new HttpError(429, "Too many requests. Try again later.");
  }

  existing.count += 1;
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown, fallback = "Internal server error") {
  if (error instanceof HttpError) {
    return jsonError(error.message, error.status);
  }

  if (isApiError(error)) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: error.status }
    );
  }

  console.error(fallback, error);
  return jsonError(fallback, 500);
}
