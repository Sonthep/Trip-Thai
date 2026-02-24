import Link from "next/link"
import { ArrowRight, Home, Map, Search } from "lucide-react"
import { TRIPS } from "@/lib/trips"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const SUGGESTED_TRIPS = TRIPS.filter((t) =>
  ["bangkok-chiang-mai", "bangkok-phuket", "bangkok-krabi", "chiang-mai-pai"].includes(t.slug)
)

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        {/* 404 visual */}
        <div className="relative mb-8 select-none">
          <span className="text-[10rem] font-black leading-none text-white/5 md:text-[14rem]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-orange-500/10 p-6 ring-1 ring-orange-500/30">
              <Search className="h-10 w-10 text-orange-400" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white md:text-3xl">
          ไม่พบหน้าที่คุณกำลังหา
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/60">
          อาจเป็นเพราะ URL ผิด หรือหน้านี้ถูกลบออกไปแล้ว
          ลองกลับหน้าหลักหรือเลือกทริปจากด้านล่าง
        </p>

        {/* Primary actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            <Home className="h-4 w-4" />
            กลับหน้าหลัก
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <Map className="h-4 w-4" />
            สำรวจแผนที่ไทย
          </Link>
        </div>

        {/* Suggested trips */}
        {SUGGESTED_TRIPS.length > 0 && (
          <div className="mt-16 w-full max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              ทริปยอดนิยม
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {SUGGESTED_TRIPS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/trip/${t.slug}`}
                  className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:border-orange-500/40 hover:bg-white/8"
                >
                  <p className="text-xs font-semibold text-white leading-snug">{t.name}</p>
                  <p className="mt-1 text-[11px] text-white/50">{t.distanceKm} กม.</p>
                  <ArrowRight className="mt-2 h-3.5 w-3.5 text-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
