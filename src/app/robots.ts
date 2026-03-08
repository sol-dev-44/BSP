import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/bsp-chat/admin/"],
      },
    ],
    sitemap: "https://www.montanaparasail.com/sitemap.xml",
  };
}
