import { google } from 'googleapis';
import { prisma } from './db';
import { getGoogleOAuthEnv } from "@/lib/env";
import { decryptToken, encryptToken } from "@/lib/token-crypto";

function createOAuth2Client() {
  const env = getGoogleOAuthEnv();
  const oauth2Client = new google.auth.OAuth2(
    env.clientId,
    env.clientSecret,
    env.redirectUri
  );

  oauth2Client.on('tokens', async (tokens) => {
    await saveGoogleTokens(tokens);
  });

  return oauth2Client;
}

export async function saveGoogleTokens(tokens: {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}) {
  await prisma.integration.upsert({
    where: { provider: 'google' },
    update: {
      ...(tokens.access_token && { accessToken: encryptToken(tokens.access_token) }),
      ...(tokens.refresh_token && { refreshToken: encryptToken(tokens.refresh_token) }),
      ...(tokens.expiry_date && { expiresAt: new Date(tokens.expiry_date) }),
    },
    create: {
      provider: 'google',
      accessToken: encryptToken(tokens.access_token),
      refreshToken: encryptToken(tokens.refresh_token),
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
  });
}

export async function getAuthenticatedGoogleClient() {
  const oauth2Client = createOAuth2Client();
  const integration = await prisma.integration.findUnique({
    where: { provider: 'google' },
  });

  if (!integration || !integration.refreshToken) {
    throw new Error('Google Integration not found or missing refresh token. Admin needs to authenticate.');
  }

  oauth2Client.setCredentials({
    access_token: decryptToken(integration.accessToken),
    refresh_token: decryptToken(integration.refreshToken),
    expiry_date: integration.expiresAt ? integration.expiresAt.getTime() : null,
  });

  return oauth2Client;
}

export function getGoogleAuthUrl(state: string) {
  const oauth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    include_granted_scopes: true,
    state,
  });
}
