import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/", "/analytics/", "/admin", "/api/"] }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/sitemap.xml`,
  };
}
