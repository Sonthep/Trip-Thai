import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThailandMapExplorerClient } from "@/components/thailand-map-explorer-client"

export const metadata: Metadata = {
  title: "สำรวจ 77 จังหวัด | TripThai — แผนที่ road trip ทั่วไทย",
  description:
    "สำรวจแผนที่ประเทศไทยทั้ง 77 จังหวัด ดูสถานที่ท่องเที่ยว เส้นทาง road trip และวางแผนทริปได้ทันที",
  openGraph: {
    title: "สำรวจ 77 จังหวัด | TripThai",
    description: "แผนที่ interactive สำรวจเส้นทาง road trip ทั่วไทย ครบ 77 จังหวัด",
    type: "website",
  },
}

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-slate-200 bg-white px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-orange-500">
                Interactive Map
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
                สำรวจ 77 จังหวัด
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                คลิกจังหวัดเพื่อดูสถานที่ท่องเที่ยว เส้นทาง และงบประมาณ
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 sm:mt-0">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                จังหวัดเลือก
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                ทั้งหมด
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map — takes remaining viewport height */}
      <main className="flex flex-1 flex-col">
        <ThailandMapExplorerClient />
      </main>

      <Footer />
    </div>
  )
}
