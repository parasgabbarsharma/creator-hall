import { logger } from "@/lib/logger";

export interface InstagramMetadata {
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  shortcode: string | null;
  type: "reel" | "post" | "tv" | "unknown";
  canonicalUrl: string;
}

/**
 * Parses an Instagram URL and extracts the shortcode + content type.
 */
function parseInstagramUrl(input: string): {
  shortcode: string;
  type: "reel" | "post" | "tv";
  canonicalUrl: string;
} | null {
  try {
    const url = new URL(input.trim().split("#")[0]!);
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "instagram.com") return null;

    const pathname = url.pathname.replace(/\/+$/, "");
    const match = pathname.match(/\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) return null;

    const rawType = match[1]!;
    const shortcode = match[2]!;
    const type: "reel" | "post" | "tv" =
      rawType === "reels" || rawType === "reel"
        ? "reel"
        : rawType === "tv"
        ? "tv"
        : "post";

    const canonicalUrl = `https://www.instagram.com/${type}/${shortcode}/`;
    return { shortcode, type, canonicalUrl };
  } catch {
    return null;
  }
}

/**
 * Decodes basic HTML entities from scraped strings.
 */
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Extract a single OG/Twitter meta tag value from raw HTML.
 */
function extractMeta(html: string, property: string): string | null {
  // Matches both property="..." and name="..." variants
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i"
  );
  const match = html.match(re) || html.match(alt);
  return match?.[1] ? decodeEntities(match[1]) : null;
}

/**
 * Fetches Instagram page HTML with browser-like headers.
 * Returns null if the request fails or Instagram blocks it.
 */
async function fetchInstagramPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
      },
      // 8 second timeout
      signal: AbortSignal.timeout(8000),
      // Don't follow redirects to login — treat them as failure
      redirect: "follow",
    });

    if (!res.ok) return null;
    const text = await res.text();
    // Instagram may redirect to login — detect this
    if (
      text.includes("accounts/login") &&
      !text.includes("og:image")
    ) {
      return null;
    }
    return text;
  } catch {
    return null;
  }
}

/**
 * Primary method: scrape Open Graph tags from the Instagram page.
 */
async function scrapeOgTags(
  canonicalUrl: string
): Promise<Partial<InstagramMetadata>> {
  const html = await fetchInstagramPage(canonicalUrl);
  if (!html) return {};

  const ogImage =
    extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
  const ogTitle =
    extractMeta(html, "og:title") || extractMeta(html, "twitter:title");
  const ogDesc =
    extractMeta(html, "og:description") ||
    extractMeta(html, "twitter:description");

  return {
    title: ogTitle,
    thumbnail: ogImage,
    description: ogDesc,
  };
}

/**
 * Main export: fetches Instagram metadata for a given URL.
 * Returns whatever it could find — title/thumbnail may be null if Instagram blocked the request.
 */
export async function fetchInstagramMetadata(
  url: string
): Promise<InstagramMetadata> {
  const parsed = parseInstagramUrl(url);

  if (!parsed) {
    throw new Error("Invalid Instagram URL. Please use a reel or post link.");
  }

  const result: InstagramMetadata = {
    title: null,
    thumbnail: null,
    description: null,
    shortcode: parsed.shortcode,
    type: parsed.type,
    canonicalUrl: parsed.canonicalUrl,
  };

  try {
    // Try scraping OG tags from the public page
    const scraped = await scrapeOgTags(parsed.canonicalUrl);

    result.title = scraped.title ?? null;
    result.thumbnail = scraped.thumbnail ?? null;
    result.description = scraped.description ?? null;
  } catch (err) {
    logger.warn({ err, url }, "Instagram metadata scrape failed");
  }

  return result;
}
