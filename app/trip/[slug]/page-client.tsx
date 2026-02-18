"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

export function TripPageClient({ tripSlug, tripName }: { tripSlug: string; tripName: string }) {
  useEffect(() => {
    // Track page view when component mounts
    analytics.viewTrip(tripSlug, tripName)
  }, [tripSlug, tripName])

  return null
}
