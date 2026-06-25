import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-auth";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const state = crypto.randomUUID();
  const url = getGoogleAuthUrl(state);
  const response = NextResponse.redirect(url);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });
  return response;
}
