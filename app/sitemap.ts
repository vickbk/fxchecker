import { config } from "@/shared/config";
import { MetadataRoute } from "next";

const SITE_URL = config.NEXT_PUBLIC_APP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  return [...staticRoutes];
}
