import { Navbar } from "@/components/navbar"
import { ThailandMapExplorerClient } from "@/components/thailand-map-explorer-client"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />
      <main className="flex-1">
        <ThailandMapExplorerClient />
      </main>
      <Footer />
    </div>
  )
}
