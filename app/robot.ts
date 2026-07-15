import { config } from "@/shared/config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${config.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
    rules: {
      userAgent: "*",
      allow: ["/", "/history/", "/compare/", "/favorites/", "/logs/"],
      disallow: ["/api/", "/_next/", "/static/"],
    },
  };
}
