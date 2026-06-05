import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig();
  const baseUrl = siteConfig.url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
