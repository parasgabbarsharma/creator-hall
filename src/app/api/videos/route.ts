import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { fetchYouTubeMetadata } from "@/lib/youtube";
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

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: { published: true },
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
  } catch (error) {
    return handleRouteError(error, "Failed to fetch videos");
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
    const { url, title, thumbnail, platform: bodyPlatform } = body;

    const validatedUrl = validateUrl(url);
    const parsed = parseSupportedVideoUrl(validatedUrl);
    const platform = bodyPlatform || parsed.platform;

    let finalTitle = title;
    let finalThumbnail = thumbnail;
    let finalDuration = null;
    
    if (platform === "YOUTUBE") {
      const ytMetadata = await fetchYouTubeMetadata(parsed.canonicalUrl);
      finalTitle = ytMetadata.title;
      finalThumbnail = ytMetadata.thumbnail;
      finalDuration = ytMetadata.duration;
    }

    const video = await prisma.video.create({
      data: {
        url: parsed.canonicalUrl,
        platform,
        title: finalTitle,
        thumbnail: finalThumbnail,
        duration: finalDuration,
        creatorName: "Paras Sharma",
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
