import { extractYouTubeId } from "./utils";

export interface YouTubeMetadata {
  title: string;
  thumbnail: string;
  duration?: string;
  creatorName?: string;
  creatorAvatar?: string;
}

export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch YouTube metadata. Verify the video is public.");
  }

  const data = await response.json() as { title?: string; author_name?: string };

  return {
    title: data.title || "Untitled Video",
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    creatorName: data.author_name || "Creator",
    creatorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.author_name || "C")}&background=random`,
    duration: "00:00",
  };
}
