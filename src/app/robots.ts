import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers (default)
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // Explicitly allow major AI crawlers
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://taskforge.xyz/sitemap.xml",
  };
}
