import { NextResponse } from "next/server";
import { destroySession, isAuthenticated } from "@/lib/auth";
import { assertSameOrigin, handleRouteError } from "@/lib/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    await destroySession();
    return NextResponse.json({ success: true, redirect: "/admin" });
  } catch (error) {
    return handleRouteError(error, "Logout failed");
  }
}
