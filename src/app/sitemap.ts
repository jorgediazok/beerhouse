import type { MetadataRoute } from "next";
import { getAllBeers } from "@/lib/contentful";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const beers = await getAllBeers().catch(() => []);

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tienda`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    ...beers.map((beer) => ({
      url: `${SITE_URL}/tienda/${beer.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
