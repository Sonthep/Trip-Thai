import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { SocialProof } from "@/components/social-proof"
import { HowItWorks } from "@/components/how-it-works"
import { ThailandMapExplorerClient } from "@/components/thailand-map-explorer-client"
import { FeaturedTrips } from "@/components/featured-trips"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <div className="bg-white">
        <SocialProof />
        <HowItWorks />
      </div>
      <div className="bg-slate-50">
        <ThailandMapExplorerClient />
      </div>
      <div className="bg-white">
        <FeaturedTrips />
        <CtaSection />
      </div>
      <Footer />
    </div>
  )
}
