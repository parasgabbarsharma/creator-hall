import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/", "/analytics/", "/admin", "/api/"] }],
    sitemap: `${getSiteUrl() || "https://your-domain.com"}/sitemap.xml`,
  };
}
