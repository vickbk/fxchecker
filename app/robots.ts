import { config } from "@/shared/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${config.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
    rules: [
      // 1. Completely block aggressive AI scrapers from burning server resources
      {
        userAgent: [
          "ClaudeBot",
          "GPTBot",
          "CCBot",
          "Bytespider",
          "PerplexityBot",
          "Anthropic-ai",
        ],
        disallow: ["/"],
      },
      // 2. Rules for standard search engines (Google, Bing, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          "/compare",
          "/favorites",
          "/history",
          "/logs",
          "/*?*", // 👈 Blocks indexing dynamic query parameters (e.g., ?from=USD&to=EUR)
        ],
      },
    ],
  };
}
