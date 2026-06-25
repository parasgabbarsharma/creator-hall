import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token";

function getMiddlewareSessionSecret(): string | undefined {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) return undefined;
  return secret;
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = getMiddlewareSessionSecret();

  if (!secret || !session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!(await verifySessionToken(session, secret))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*"],
};
