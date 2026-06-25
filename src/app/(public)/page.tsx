import { prisma } from "@/lib/db";
import { HomeClient } from "@/components/home/home-client";
import { Video } from "@prisma/client";
import { DEFAULT_PAGE_SIZE, CREATOR_NAME, CREATOR_NICKNAME } from "@/lib/config";
import { isYouTubeShortUrl } from "@/lib/video-url";
import { getLiveChannelStats } from "@/lib/youtube-data";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ q?: string; tab?: string; ytCursor?: string; igCursor?: string }>;
}

const getCachedVideoCount = unstable_cache(
  async (queryWhere) => prisma.video.count({ where: queryWhere }),
  ["video-count"],
  { revalidate: 60, tags: ["video-count"] }
);

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, tab, ytCursor, igCursor } = await searchParams;
  const searchQuery = q?.trim().slice(0, 120);

  const baseWhere = {
    published: true,
    ...(searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            { description: { contains: searchQuery, mode: "insensitive" as const } },
            { creatorName: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const ytWhere = { ...baseWhere, platform: "YOUTUBE" as const };
  const igWhere = { ...baseWhere, platform: "INSTAGRAM" as const };

  const ytCursorFilter = ytCursor ? { id: { lt: ytCursor } } : {};
  const igCursorFilter = igCursor ? { id: { lt: igCursor } } : {};

  let rawYoutubeVideos: Video[] = [];
  let rawInstagramVideos: Video[] = [];
  let channelInfo: { creatorAvatar: string | null; creatorName: string | null } | null = null;
  let totalCount = 0;

  try {
    const results = await Promise.all([
      prisma.video.findMany({
        where: { ...ytWhere, ...ytCursorFilter },
        orderBy: { createdAt: "desc" },
        take: DEFAULT_PAGE_SIZE + 1,
      }),
      prisma.video.findMany({
        where: { ...igWhere, ...igCursorFilter },
        orderBy: { createdAt: "desc" },
        take: DEFAULT_PAGE_SIZE + 1,
      }),

      prisma.video.findFirst({
        where: { platform: "YOUTUBE", published: true, creatorAvatar: { not: null } },
        select: { creatorAvatar: true, creatorName: true },
        orderBy: { createdAt: "desc" },
      }),
      getCachedVideoCount(baseWhere),
    ]);

    [rawYoutubeVideos, rawInstagramVideos, channelInfo, totalCount] = results;
  } catch (error) {
    console.error("Database connection failed. Falling back to empty state.", error);
  }

  // Fetch live YouTube stats to fulfill the request
  const liveStats = await getLiveChannelStats();
  const avatarToUse = liveStats.avatar || channelInfo?.creatorAvatar || null;
  const nameToUse = liveStats.name || channelInfo?.creatorName || `${CREATOR_NAME} ${CREATOR_NICKNAME}`;

  const hasMoreYt = rawYoutubeVideos.length > DEFAULT_PAGE_SIZE;
  const itemsYt = hasMoreYt ? rawYoutubeVideos.slice(0, DEFAULT_PAGE_SIZE) : rawYoutubeVideos;
  const nextYtCursor = hasMoreYt ? itemsYt[itemsYt.length - 1]?.id ?? null : null;

  const hasMoreIg = rawInstagramVideos.length > DEFAULT_PAGE_SIZE;
  const itemsIg = hasMoreIg ? rawInstagramVideos.slice(0, DEFAULT_PAGE_SIZE) : rawInstagramVideos;
  const nextIgCursor = hasMoreIg ? itemsIg[itemsIg.length - 1]?.id ?? null : null;

  const youtubeVideos: Video[] = itemsYt as unknown as Video[];
  const instagramVideos: Video[] = itemsIg as unknown as Video[];

  const youtubeLong = youtubeVideos.filter((v) => !isYouTubeShortUrl(v.url));
  const youtubeShorts = youtubeVideos.filter((v) => isYouTubeShortUrl(v.url));

  return (
    <HomeClient
      youtubeLong={youtubeLong}
      youtubeShorts={youtubeShorts}
      instagramVideos={instagramVideos}
      searchQuery={searchQuery}
      defaultTab={tab}
      channelAvatar={avatarToUse}
      channelName={nameToUse}
      totalVideos={totalCount}

      hasMoreYt={hasMoreYt}
      hasMoreIg={hasMoreIg}
      nextYtCursor={nextYtCursor}
      nextIgCursor={nextIgCursor}
      ytCursor={ytCursor}
      igCursor={igCursor}

      subscriberCount={liveStats.subscriberCount}
      viewCount={liveStats.viewCount}
      videoCount={liveStats.videoCount}
    />
  );
}
