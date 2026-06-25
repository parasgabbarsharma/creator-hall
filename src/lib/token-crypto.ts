import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { getOptionalTokenEncryptionKey } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";

function decodeKey(): Buffer {
  const raw = getOptionalTokenEncryptionKey();
  if (!raw) {
    throw new Error("TOKEN_ENCRYPTION_KEY is required before storing OAuth tokens");
  }

  const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
  const key = Buffer.from(normalized, "base64");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes");
  }
  return key;
}

export function encryptToken(token: string | null | undefined): string | null {
  if (!token) return null;
  const key = decodeKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptToken(token: string | null | undefined): string | null {
  if (!token) return null;
  if (!token.startsWith("v1.")) return token;

  const [, ivRaw, tagRaw, encryptedRaw] = token.split(".");
  if (!ivRaw || !tagRaw || !encryptedRaw) {
    throw new Error("Invalid encrypted token format");
  }

  const key = decodeKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedRaw, "base64url")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
