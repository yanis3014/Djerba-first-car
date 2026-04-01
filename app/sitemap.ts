import type { MetadataRoute } from "next";
import { getAllCars } from "@/lib/cars";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const cars = await getAllCars();

  const staticPaths: {
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/voitures", priority: 0.9, changeFrequency: "daily" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  for (const car of cars) {
    entries.push({
      url: `${base}/voitures/${car.slug}`,
      lastModified: new Date(car.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
