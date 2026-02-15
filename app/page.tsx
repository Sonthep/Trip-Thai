import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Regions } from "@/components/regions"
import { FeaturedTrips } from "@/components/featured-trips"
import { HowItWorks } from "@/components/how-it-works"
import { MapPreview } from "@/components/map-preview"
import { SocialProof } from "@/components/social-proof"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Regions />
        <FeaturedTrips />
        <HowItWorks />
        <MapPreview />
        <SocialProof />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
