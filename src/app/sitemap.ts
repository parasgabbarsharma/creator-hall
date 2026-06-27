import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

const BASE_URL = getSiteUrl() || "https://your-domain.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 }];
}
