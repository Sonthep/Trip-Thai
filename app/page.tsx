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
import { TestimonialsSection } from "@/components/testimonials-section"
import { SectionSkeleton } from "@/components/section-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />

      {/* 1. อธิบายก่อน แล้วค่อย social proof */}
      <div className="bg-white">
        <HowItWorks />
        <SocialProof />
      </div>

      {/* 2. Trust — testimonials อยู่ใกล้ social proof */}
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <TestimonialsSection />
        </Suspense>
      </ErrorBoundary>

      {/* 3. Features */}
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton rows={2} />}>
          <ExperienceBento />
        </Suspense>
      </ErrorBoundary>

      {/* 4. Inspire — ตัวอย่างทริป (ลบ TrendingTrips ออก เหลือแค่ FeaturedTrips) */}
      <div className="bg-white">
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton rows={2} />}>
            <FeaturedTrips />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* 5. Deal */}
      <SeasonalCallout />

      {/* 6. Try it — แผนที่ */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-[520px] bg-slate-50" />}>
          <div id="map-explorer" className="bg-slate-50">
            <ThailandMapExplorerClient />
          </div>
        </Suspense>
      </ErrorBoundary>

      {/* 7. Action */}
      <div className="bg-white">
        <CtaSection />
      </div>

      <Footer />
      <StickyMobileCTA />
    </div>
  )
}
