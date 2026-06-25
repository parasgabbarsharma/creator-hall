export type SupportedPlatform = "YOUTUBE" | "INSTAGRAM";

export type ParsedVideoUrl = {
  platform: SupportedPlatform;
  canonicalUrl: string;
  id: string;
  isShort: boolean;
};

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const INSTAGRAM_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

function normalizedHost(url: URL): string {
  return url.hostname.toLowerCase().replace(/^www\./, "");
}

export function parseSupportedVideoUrl(input: string): ParsedVideoUrl {
  let url: URL;

  try {
    // Strip hash fragments just in case
    url = new URL(input.trim().split('#')[0]!);
  } catch {
    throw new Error("Enter a valid URL.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only HTTPS URLs are supported.");
  }

  const host = normalizedHost(url);
  const pathname = url.pathname.replace(/\/+$/, ""); // strip trailing slashes

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (pathname === "/watch") {
      const id = url.searchParams.get("v");
      if (id && YOUTUBE_ID_PATTERN.test(id)) {
        return {
          platform: "YOUTUBE",
          canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
          id,
          isShort: false,
        };
      }
    }

    const shortsMatch = pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})$/);
    if (shortsMatch) {
      return {
        platform: "YOUTUBE",
        canonicalUrl: `https://www.youtube.com/shorts/${shortsMatch[1]}`,
        id: shortsMatch[1]!,
        isShort: true,
      };
    }
    
    // Support youtube.com/embed/XYZ
    const embedMatch = pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})$/);
    if (embedMatch) {
      return {
        platform: "YOUTUBE",
        canonicalUrl: `https://www.youtube.com/watch?v=${embedMatch[1]}`,
        id: embedMatch[1]!,
        isShort: false,
      };
    }
  }

  if (host === "youtu.be") {
    // youtu.be/id?t=10 - the id is just the pathname
    const id = pathname.replace(/^\/+/, "");
    if (YOUTUBE_ID_PATTERN.test(id)) {
      return {
        platform: "YOUTUBE",
        canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
        id,
        isShort: false,
      };
    }
  }

  if (host === "instagram.com") {
    // Matches /reel/ID or /username/reel/ID
    const match = pathname.match(/\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)$/);
    if (match && INSTAGRAM_ID_PATTERN.test(match[2]!)) {
      // Always normalize to /reel/ or /p/ (reels -> reel)
      const type = match[1] === 'reels' ? 'reel' : match[1];
      const id = match[2];
      return {
        platform: "INSTAGRAM",
        canonicalUrl: `https://www.instagram.com/${type}/${id}/`,
        id: id!,
        isShort: true,
      };
    }
  }

  throw new Error("Only YouTube videos, YouTube Shorts, and Instagram posts/reels are supported.");
}

export function isValidVideoId(id: string): boolean {
  return /^c[a-z0-9]{20,}$/i.test(id);
}

export function isYouTubeShortUrl(url: string): boolean {
  try {
    const parsed = parseSupportedVideoUrl(url);
    return parsed.platform === "YOUTUBE" && parsed.isShort;
  } catch {
    return url.includes("/shorts/");
  }
}
