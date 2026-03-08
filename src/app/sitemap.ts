import type { MetadataRoute } from "next";
import { BUSINESS_INFO } from "@/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.url;

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/book", priority: 0.95, changeFrequency: "daily" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.8, changeFrequency: "weekly" },
    { path: "/location", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/jobs", priority: 0.5, changeFrequency: "monthly" },
    { path: "/bsp-chat", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
