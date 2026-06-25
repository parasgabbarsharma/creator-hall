import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { fetchYouTubeMetadata } from "@/lib/youtube";
import { fetchInstagramMetadata } from "@/lib/instagram";
import { parseSupportedVideoUrl } from "@/lib/video-url";
import {
  assertSameOrigin,
  getClientIp,
  handleRouteError,
  rateLimit,
} from "@/lib/security";
import { validateUrl, validatePaginationParams } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { limit, cursor } = validatePaginationParams(
      searchParams.get("limit"),
      searchParams.get("cursor")
    );

    const cursorFilter = cursor ? { cursor: { id: cursor }, skip: 1 } : {};

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: { published: true },
        ...cursorFilter,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
      }),
      prisma.video.count({ where: { published: true } }),
    ]);

    const hasMore = videos.length > limit;
    const items = hasMore ? videos.slice(0, limit) : videos;
    const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

    return NextResponse.json(
      { items, total, hasMore, nextCursor },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertSameOrigin(request);
    await rateLimit(`video:create:${getClientIp(request)}`, { limit: 20, windowMs: 60_000 });

    const body = await request.json();
    const { url } = body;

    const validatedUrl = validateUrl(url);

    const parsed = parseSupportedVideoUrl(validatedUrl);
    let platform: "YOUTUBE" | "INSTAGRAM";
    let metadata: {
      title: string;
      thumbnail: string;
      duration?: string;
      creatorName?: string;
      creatorAvatar?: string;
    };

    if (parsed.platform === "YOUTUBE") {
      platform = "YOUTUBE";
      metadata = await fetchYouTubeMetadata(parsed.canonicalUrl);
    } else {
      platform = "INSTAGRAM";
      metadata = await fetchInstagramMetadata(parsed.canonicalUrl);
    }

    const video = await prisma.video.create({
      data: {
        url: parsed.canonicalUrl,
        platform,
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        duration: metadata.duration,
        creatorName: metadata.creatorName,
        creatorAvatar: metadata.creatorAvatar,
        published: true,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("URL") || error.message.includes("supported"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "This content is already in the library." }, { status: 409 });
    }
    return handleRouteError(error, "Failed to add video");
  }
}
