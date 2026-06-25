import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchInstagramMetadata } from "@/lib/instagram";
import { handleRouteError } from "@/lib/security";

/**
 * GET /api/instagram/metadata?url=...
 *
 * Fetches Instagram reel/post metadata (title, thumbnail, description)
 * by scraping Open Graph tags from the public page.
 * No API key required.
 *
 * Protected: admin only.
 */
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { error: "Missing url query parameter." },
        { status: 400 }
      );
    }

    const metadata = await fetchInstagramMetadata(url);

    return NextResponse.json(metadata, {
      headers: {
        // Cache for 10 minutes — thumbnail CDN URLs can expire
        "Cache-Control": "private, max-age=600",
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Invalid Instagram")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return handleRouteError(err, "Failed to fetch Instagram metadata");
  }
}
