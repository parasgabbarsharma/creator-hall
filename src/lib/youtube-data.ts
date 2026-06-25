import { google } from "googleapis";
import type { youtube_v3 } from "googleapis";
import { prisma } from "./db";
import { getYouTubeEnv } from "./env";
import { parse } from "tinyduration";

function getYouTubeClient() {
  const env = getYouTubeEnv();
  return {
    youtube: google.youtube({
      version: "v3",
      auth: env.apiKey,
    }),
    channelId: env.channelId,
  };
}

export async function getLiveChannelStats(): Promise<{ avatar: string | null; name: string | null; subscriberCount: string; viewCount: string; videoCount: string }> {
  try {
    const { youtube, channelId } = getYouTubeClient();
    if (!channelId || channelId === "YOUR_CHANNEL_ID_HERE") return { avatar: null, name: null, subscriberCount: "0", viewCount: "0", videoCount: "0" };

    const channelRes = await youtube.channels.list({
      part: ["snippet", "statistics"],
      id: [channelId],
    });

    const channel = channelRes.data.items?.[0];
    if (!channel) return { avatar: null, name: null, subscriberCount: "0", viewCount: "0", videoCount: "0" };

    const avatar = channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url || null;
    const name = channel.snippet?.title || null;
    
    const subscriberCount = channel.statistics?.subscriberCount || "0";
    const viewCount = channel.statistics?.viewCount || "0";
    const videoCount = channel.statistics?.videoCount || "0";

    return { avatar, name, subscriberCount, viewCount, videoCount };
  } catch {
    return { avatar: null, name: null, subscriberCount: "0", viewCount: "0", videoCount: "0" };
  }
}

export async function syncYouTubeChannelData() {
  // Use database for distributed locking
  const lockProvider = "youtube_sync_lock";
  
  try {
    const lock = await prisma.integration.findUnique({ where: { provider: lockProvider } });
    if (lock && lock.updatedAt > new Date(Date.now() - 5 * 60 * 1000)) {
      return { success: false, error: "Sync is already running." };
    }
    
    await prisma.integration.upsert({
      where: { provider: lockProvider },
      create: { provider: lockProvider, updatedAt: new Date() },
      update: { updatedAt: new Date() },
    });
  } catch {
    return { success: false, error: "Could not acquire sync lock." };
  }

  try {
    const { youtube, channelId } = getYouTubeClient();
    if (!channelId || channelId === "YOUR_CHANNEL_ID_HERE") {
      throw new Error("Please set your actual YOUTUBE_CHANNEL_ID in the .env file.");
    }

    const channelRes = await youtube.channels.list({
      part: ["contentDetails", "snippet"],
      id: [channelId],
    });

    const channel = channelRes.data.items?.[0];
    if (!channel) throw new Error(`Could not find YouTube channel with ID: ${channelId}`);

    const channelAvatar = channel.snippet?.thumbnails?.high?.url
      || channel.snippet?.thumbnails?.default?.url
      || "";
    const channelTitle = channel.snippet?.title || "Creator";

    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error("Could not find uploads playlist");

    let nextPageToken: string | undefined = undefined;
    let totalSynced = 0;

    do {
      const playlistRes = await youtube.playlistItems.list({
        part: ["snippet", "contentDetails"],
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken,
      }) as { data: { items?: youtube_v3.Schema$PlaylistItem[]; nextPageToken?: string | null } };

      const items = playlistRes.data.items || [];
      const videoIds = items.map((item) => item.contentDetails?.videoId).filter(Boolean) as string[];

      if (videoIds.length > 0) {
        const videosRes = await youtube.videos.list({
          part: ["contentDetails", "snippet", "statistics"],
          id: videoIds,
        });

        const videoDetails = videosRes.data.items || [];
        const bulkOps = [];
        let newVideosCount = 0;

        const urls = videoDetails.map(v => {
          const durationIso = v.contentDetails?.duration || "PT0S";
          const isShort = isDurationLessThan60s(durationIso);
          return isShort
            ? `https://www.youtube.com/shorts/${v.id}`
            : `https://www.youtube.com/watch?v=${v.id}`;
        });

        const existingVideos = await prisma.video.findMany({
          where: { url: { in: urls } },
          select: { url: true },
        });
        const existingUrls = new Set(existingVideos.map(v => v.url));

        for (const video of videoDetails) {
          const videoId = video.id!;
          const title = video.snippet?.title || "Untitled";
          const description = video.snippet?.description || "";
          const thumbnail = video.snippet?.thumbnails?.maxres?.url
            || video.snippet?.thumbnails?.high?.url
            || video.snippet?.thumbnails?.default?.url
            || "";

          const publishedAt = video.snippet?.publishedAt
            ? new Date(video.snippet.publishedAt)
            : new Date();

          const durationIso = video.contentDetails?.duration || "PT0S";
          const isShort = isDurationLessThan60s(durationIso);
          const url = isShort
            ? `https://www.youtube.com/shorts/${videoId}`
            : `https://www.youtube.com/watch?v=${videoId}`;

          const displayDuration = formatIsoDuration(durationIso);


          if (!existingUrls.has(url)) newVideosCount++;

          bulkOps.push(
            prisma.video.upsert({
              where: { url },
              create: {
                url,
                platform: "YOUTUBE",
                title,
                description,
                thumbnail,
                creatorName: channelTitle,
                creatorAvatar: channelAvatar,
                duration: displayDuration,
                createdAt: publishedAt,
                published: true,
              },
              update: {
                title,
                description,
                thumbnail,
                creatorName: channelTitle,
                creatorAvatar: channelAvatar,
                duration: displayDuration,
                createdAt: publishedAt,
              },
            })
          );
        }

        if (bulkOps.length > 0) {
          await prisma.$transaction(bulkOps);
          totalSynced += newVideosCount;
        }
      }

      nextPageToken = playlistRes.data.nextPageToken || undefined;
    } while (nextPageToken);

    return { success: true, count: totalSynced };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("YouTube Data API Sync Error:", message);
    return { success: false, error: message };
  } finally {
    await prisma.integration.update({
      where: { provider: lockProvider },
      data: { updatedAt: new Date(0) }, // Release lock
    }).catch(() => {});
  }
}

function isDurationLessThan60s(isoString: string): boolean {
  try {
    const parsed = parse(isoString);
    const hours = parsed.hours || 0;
    const minutes = parsed.minutes || 0;
    const seconds = parsed.seconds || 0;
    const days = parsed.days || 0;
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    return totalSeconds <= 60;
  } catch {
    return false;
  }
}

function formatIsoDuration(isoString: string): string {
  try {
    const parsed = parse(isoString);
    const hours = parsed.hours || 0;
    const minutes = parsed.minutes || 0;
    const seconds = parsed.seconds || 0;
    const mStr = hours > 0 ? minutes.toString().padStart(2, "0") : minutes.toString();
    const sStr = seconds.toString().padStart(2, "0");
    if (hours > 0) return `${hours}:${mStr}:${sStr}`;
    return `${mStr}:${sStr}`;
  } catch {
    return "0:00";
  }
}

export async function getLiveVideos(limit = 50) {
  try {
    const env = getYouTubeEnv();
    if (!env.channelId || env.channelId === "YOUR_CHANNEL_ID_HERE") return [];

    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${env.channelId}&key=${env.apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const channelData = await res.json();
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) return [];

    const playlistRes = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=${limit}&playlistId=${uploadsPlaylistId}&key=${env.apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const playlistData = await playlistRes.json();
    const videoIds = (playlistData.items || []).map((i: any) => i.contentDetails?.videoId).filter(Boolean);

    if (videoIds.length === 0) return [];

    const videosRes = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2Csnippet&id=${videoIds.join(',')}&key=${env.apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const videosData = await videosRes.json();

    return (videosData.items || []).map((v: any) => {
      const durationIso = v.contentDetails?.duration || "PT0S";
      const isShort = isDurationLessThan60s(durationIso);
      const url = isShort ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`;
      
      return {
        id: v.id,
        url,
        platform: "YOUTUBE" as const,
        title: v.snippet?.title || "Untitled",
        description: v.snippet?.description || "",
        thumbnail: v.snippet?.thumbnails?.maxres?.url || v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.default?.url || "",
        duration: formatIsoDuration(durationIso),
        createdAt: new Date(v.snippet?.publishedAt || Date.now()),
        creatorName: "",
        creatorAvatar: "",
        published: true,
        tags: [],
        isShort
      };
    });
  } catch (error) {
    console.error("Live fetch failed:", error);
    return [];
  }
}
