function getEnv(name: string): string | undefined {
  let value = process.env[name]?.trim();
  if (!value) return undefined;
  
  // Strip wrapping quotes if user accidentally included them in Vercel
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

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

export function getSiteUrl(): string | undefined {
  return getEnv("NEXT_PUBLIC_SITE_URL");
}

export function getYouTubeEnv() {
  return {
    apiKey: requireEnv("YOUTUBE_API_KEY"),
    channelId: requireEnv("YOUTUBE_CHANNEL_ID"),
  };
}
