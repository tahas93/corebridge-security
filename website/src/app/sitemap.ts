import type { MetadataRoute } from "next";
import { cmsApi } from "@/services/cms";
import { getSiteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = await getSiteConfig();
  const pages = (await cmsApi.getPages()) as { data?: { slug: string }[] };
  const slugs = pages.data?.length
    ? pages.data
    : [{ slug: "home" }, { slug: "about" }, { slug: "services" }, { slug: "solutions" }, { slug: "contact" }];
  const now = new Date();

  return slugs.map((page) => ({
    url: `${siteConfig.url}/${page.slug === "home" ? "" : page.slug}`.replace(/\/$/, ""),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: page.slug === "home" ? 1 : 0.7,
  }));
}
