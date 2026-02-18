type EventParams = Record<string, string | number | boolean | undefined>

/**
 * Track custom events for analytics
 * Currently logs to console in development
 * Can be connected to GA4, Mixpanel, or custom analytics service
 */
export function trackEvent(eventName: string, params?: EventParams) {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${eventName}`, params)
  }

  // In production, send to analytics service
  // Example: Google Analytics 4
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", eventName, params)
  }

  // You can add other analytics providers here
  // Example: Mixpanel, Posthog, Plausible, etc.
}

/**
 * Common event tracking helpers
 */
export const analytics = {
  // Trip-related events
  viewTrip: (tripSlug: string, tripName: string) => {
    trackEvent("view_trip", {
      trip_slug: tripSlug,
      trip_name: tripName,
    })
  },

  clickSaveTrip: (tripSlug: string) => {
    trackEvent("click_save_trip", {
      trip_slug: tripSlug,
    })
  },

  submitLead: (tripSlug: string, email: string) => {
    trackEvent("submit_lead", {
      trip_slug: tripSlug,
      // Hash email or use only domain for privacy
      email_domain: email.split("@")[1] || "unknown",
    })
  },

  clickShare: (tripSlug: string, platform?: string) => {
    trackEvent("click_share", {
      trip_slug: tripSlug,
      platform: platform || "generic",
    })
  },

  // Calculator events
  calculateTrip: (origin: string, destination: string, days: number) => {
    trackEvent("calculate_trip", {
      origin,
      destination,
      days,
    })
  },

  // Navigation events
  clickFeaturedTrip: (tripSlug: string) => {
    trackEvent("click_featured_trip", {
      trip_slug: tripSlug,
    })
  },

  // Engagement events
  scrollDepth: (percentage: number) => {
    trackEvent("scroll", {
      depth_percentage: percentage,
    })
  },
}
