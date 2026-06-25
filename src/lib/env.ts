function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value) return undefined;
  if (value.startsWith("GET_FROM_") || value.startsWith("REPLACE_WITH_")) {
    throw new Error(
      `${name} contains a placeholder value ("${value}"). Set a real value before starting.`
    );
  }
  return value;
}

function requireEnv(name: string): string {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function requireStrongSecret(name: string): string {
  const value = requireEnv(name);
  if (value.length < 32) {
    throw new Error(`${name} must be at least 32 characters long`);
  }
  return value;
}

export function getGoogleOAuthEnv() {
  return {
    clientId: requireEnv("GOOGLE_CLIENT_ID"),
    clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
    redirectUri: requireEnv("GOOGLE_REDIRECT_URI"),
  };
}

export function getOptionalTokenEncryptionKey(): string | undefined {
  const key = getEnv("TOKEN_ENCRYPTION_KEY");
  if (key && key.length < 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be at least 32 characters when provided");
  }
  return key;
}

export function getSessionSecret(): string {
  return requireStrongSecret("SESSION_SECRET");
}

export function getAdminPasswordHash(): string {
  const hash = requireEnv("ADMIN_PASSWORD_HASH");
  if (hash.length < 60) {
    throw new Error("ADMIN_PASSWORD_HASH appears to be invalid (bcrypt hashes are typically 60+ characters)");
  }
  return hash;
}

export function getCronSecret(): string {
  return requireStrongSecret("CRON_SECRET");
}

export function getYouTubeEnv() {
  return {
    apiKey: requireEnv("YOUTUBE_API_KEY"),
    channelId: requireEnv("YOUTUBE_CHANNEL_ID"),
  };
}
