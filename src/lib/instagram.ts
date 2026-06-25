import { extractInstagramId } from "./utils";
import { parseSupportedVideoUrl } from "@/lib/video-url";

export interface InstagramMetadata {
  title: string;
  thumbnail: string;
  duration?: string;
  creatorName?: string;
  creatorAvatar?: string;
}

export async function fetchInstagramMetadata(url: string): Promise<InstagramMetadata> {
  const parsed = parseSupportedVideoUrl(url);
  const mediaId = extractInstagramId(url);
  if (!mediaId) {
    throw new Error("Invalid Instagram URL");
  }

  // Instagram oEmbed requires an access token, so we use a fallback for now
  return {
    title: parsed.canonicalUrl.includes("/reel/") ? "Instagram Reel" : "Instagram Post",
    thumbnail: "https://ui-avatars.com/api/?name=Reel&background=e1306c&color=fff&size=512",
    creatorName: "Instagram Creator",
    creatorAvatar: "https://ui-avatars.com/api/?name=I&background=random",
    duration: "00:00",
  };
}
