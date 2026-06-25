import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseSupportedVideoUrl } from "@/lib/video-url";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidYouTubeUrl(url: string): boolean {
  try {
    return parseSupportedVideoUrl(url).platform === "YOUTUBE";
  } catch {
    return false;
  }
}

export function isValidInstagramUrl(url: string): boolean {
  try {
    return parseSupportedVideoUrl(url).platform === "INSTAGRAM";
  } catch {
    return false;
  }
}

export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = parseSupportedVideoUrl(url);
    return parsed.platform === "YOUTUBE" ? parsed.id : null;
  } catch {
    return null;
  }
}

export function extractInstagramId(url: string): string | null {
  try {
    const parsed = parseSupportedVideoUrl(url);
    return parsed.platform === "INSTAGRAM" ? parsed.id : null;
  } catch {
    return null;
  }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return "scheduled";
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}
