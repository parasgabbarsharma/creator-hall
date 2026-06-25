import { NextResponse } from "next/server";
import { isApiError } from "./api-errors";
import { logger } from "./logger";

import { redis } from "./redis";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

class LRUCache<K, V> {
  private max: number;
  private cache: Map<K, V>;

  constructor(max = 5000) {
    this.max = max;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key: K, val: V) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.max) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, val);
  }
}

const localRateLimitStore = new LRUCache<string, RateLimitEntry>(5000);

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

  if (redis) {
    try {
      const windowSeconds = Math.ceil(options.windowMs / 1000);
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }
      
      if (count > options.limit) {
        throw new HttpError(429, "Too many requests. Try again later.");
      }
      return;
    } catch (e) {
      if (e instanceof HttpError) throw e;
      logger.error({ err: e }, "Redis rate limit failed, falling back to local LRU");
    }
  }

  const existing = localRateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    localRateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
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

  logger.error({ err: error }, fallback);
  return jsonError(fallback, 500);
}
