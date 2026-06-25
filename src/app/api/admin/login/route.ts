import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth";
import {
  assertSameOrigin,
  getClientIp,
  handleRouteError,
  rateLimit,
} from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await rateLimit(`login:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 });

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "Login failed");
  }
}
