import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { SocialProof } from "@/components/social-proof"
import { HowItWorks } from "@/components/how-it-works"
import { ExperienceBento } from "@/components/experience-bento"
import { SeasonalCallout } from "@/components/seasonal-callout"
import { ThailandMapExplorerClient } from "@/components/thailand-map-explorer-client"
import { FeaturedTrips } from "@/components/featured-trips"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"
import { TrendingTrips } from "@/components/trending-trips"
import { TestimonialsSection } from "@/components/testimonials-section"
import { SectionSkeleton } from "@/components/section-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />

      <div className="bg-white">
        <SocialProof />
        <HowItWorks />
      </div>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton rows={3} />}>
          <TrendingTrips />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <ExperienceBento />
        </Suspense>
      </ErrorBoundary>

      <SeasonalCallout />

      <ErrorBoundary>
        <Suspense fallback={<div className="h-[520px] bg-slate-50" />}>
          <div id="map-explorer" className="bg-slate-50">
            <ThailandMapExplorerClient />
          </div>
        </Suspense>
      </ErrorBoundary>

      <div className="bg-white">
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton rows={2} />}>
            <FeaturedTrips />
          </Suspense>
        </ErrorBoundary>
        <CtaSection />
      </div>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <TestimonialsSection />
        </Suspense>
      </ErrorBoundary>

      <Footer />
      <StickyMobileCTA />
    </div>
  )
}
