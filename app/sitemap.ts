import type { MetadataRoute } from "next"
import { TRIPS } from "@/lib/trips"
import { REGIONS } from "@/lib/regions"
import { getSiteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
  ]

  const regionPages: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${baseUrl}/region/${r.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const tripPages: MetadataRoute.Sitemap = TRIPS.map((trip) => ({
    url: `${baseUrl}/trip/${trip.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...regionPages, ...tripPages]
}
