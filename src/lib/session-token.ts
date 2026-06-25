export const SESSION_COOKIE_NAME = "creator_platform_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sid: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string | Buffer | Uint8Array): string {
  if (Buffer.isBuffer(value)) {
    return value.toString('base64url');
  }
  const bytes =
    typeof value === "string"
      ? Buffer.from(value, 'utf8')
      : Buffer.from(value);
  return bytes.toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncode(Buffer.from(signature));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function randomSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

export async function createSessionToken(secret: string, now = Date.now()): Promise<string> {
  const issuedAt = Math.floor(now / 1000);
  const payload: SessionPayload = {
    sid: randomSessionId(),
    iat: issuedAt,
    exp: issuedAt + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  now = Date.now()
): Promise<boolean> {
  const [encodedPayload, signature, ...extra] = token.split(".");
  if (!encodedPayload || !signature || extra.length > 0) return false;

  const expected = await sign(encodedPayload, secret);
  if (!constantTimeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload.sid || typeof payload.exp !== "number" || typeof payload.iat !== "number") {
      return false;
    }
    const currentSeconds = Math.floor(now / 1000);
    return payload.exp > currentSeconds && payload.iat <= currentSeconds;
  } catch {
    return false;
  }
}
