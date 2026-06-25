import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { isAuthenticated } from "@/lib/auth";
import { getGoogleOAuthEnv } from "@/lib/env";
import { saveGoogleTokens } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expectedState = request.cookies.get("google_oauth_state")?.value;

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=NoCodeProvided", request.url));
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/dashboard?error=InvalidOAuthState", request.url));
  }

  try {
    const env = getGoogleOAuthEnv();
    const oauth2Client = new google.auth.OAuth2(
      env.clientId,
      env.clientSecret,
      env.redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);

    await saveGoogleTokens(tokens);

    const response = NextResponse.redirect(new URL("/dashboard?success=GoogleConnected", request.url));
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=GoogleAuthFailed", request.url));
  }
}
