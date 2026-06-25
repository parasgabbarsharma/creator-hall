import { NextResponse } from "next/server";
import { syncYouTubeChannelData } from "@/lib/youtube-data";
import { getCronSecret } from "@/lib/env";
import { getClientIp, handleRouteError, rateLimit } from "@/lib/security";
import { timingSafeEqual, createHash } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  try {
    const aHash = createHash('sha256').update(a).digest();
    const bHash = createHash('sha256').update(b).digest();
    return timingSafeEqual(aHash, bHash);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    await rateLimit(`cron:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 });
    const authHeader = request.headers.get("authorization");
    const cronSecret = getCronSecret();

    if (!authHeader || !safeEqual(authHeader, `Bearer ${cronSecret}`)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await syncYouTubeChannelData();

    if (result.success) {
      return NextResponse.json({
        message: `Successfully synced ${result.count} videos.`,
      });
    }

    return NextResponse.json({ error: "YouTube sync failed" }, { status: 500 });
  } catch (error) {
    return handleRouteError(error, "YouTube sync failed");
  }
}
