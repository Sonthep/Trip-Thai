import type { MetadataRoute } from "next"
import { TRIPS } from "@/lib/trips"
import { getSiteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ]

  const tripPages: MetadataRoute.Sitemap = TRIPS.map((trip) => ({
    url: `${baseUrl}/trip/${trip.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticPages, ...tripPages]
}
