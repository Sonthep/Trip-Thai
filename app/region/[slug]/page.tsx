import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, MapPin, Wallet } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"
import { REGIONS, getRegionBySlug, getTripsByRegion } from "@/lib/regions"
import { getSiteUrl } from "@/lib/site"

type RegionPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return REGIONS.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { slug } = await params
  const region = getRegionBySlug(slug)
  if (!region) return {}
  return {
    title: `${region.name} Road Trip | TripThai`,
    description: region.description,
  }
}

const TRIP_PHOTOS: Record<string, string> = {
  "bangkok-chiang-mai": "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&q=75",
  "bangkok-phuket": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=75",
  "bangkok-khao-yai": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
  "bangkok-hua-hin": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=75",
  "bangkok-ayutthaya": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=75",
  "bangkok-kanchanaburi": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
  "bangkok-pattaya": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=75",
  "bangkok-chiang-rai": "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&q=75",
  "bangkok-krabi": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&q=75",
}
const FALLBACK = "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=600&q=75"

export default async function RegionPage({ params }: RegionPageProps) {
  const { slug } = await params
  const region = getRegionBySlug(slug)
  if (!region) notFound()

  const trips = getTripsByRegion(region)
  const baseUrl = getSiteUrl()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristDestination",
        "@id": `${baseUrl}/region/${region.slug}`,
        name: region.name,
        description: region.description,
        url: `${baseUrl}/region/${region.slug}`,
        image: region.heroImg,
        touristType: "Road Trip",
        includesAttraction: region.stops.map((stop) => ({
          "@type": "TouristAttraction",
          name: stop,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "สำรวจ", item: `${baseUrl}/explore` },
          { "@type": "ListItem", position: 3, name: region.name, item: `${baseUrl}/region/${region.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative h-[56vh] min-h-[400px] overflow-hidden lg:h-[65vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={region.heroImg}
          alt={region.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-0 top-0 px-6 pt-6">
          <nav className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-white">สำรวจ</Link>
            <span>/</span>
            <span className="text-white/80">{region.name}</span>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 px-6 pb-12 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            {region.nameEn}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {region.name}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/70">
            {region.tagline}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              🗓 เหมาะช่วง {region.bestSeason}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              💰 {region.budgetRange} / ทริป
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              🛣 {region.routeCount}+ เส้นทาง
            </span>
          </div>
        </div>
      </section>

      <div className="bg-white">
        {/* ── Highlights bar ──────────────────────────────────── */}
        <section className="border-b border-slate-100 py-10">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {region.highlights.map((h) => (
                <div key={h.label} className="text-center">
                  <p className="text-2xl">{h.icon}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {h.label}
                  </p>
                  <p className="mt-0.5 text-base font-bold text-slate-900">{h.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Description ─────────────────────────────────────── */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
                เกี่ยวกับ{region.name}
              </p>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">{region.description}</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Top Routes ──────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
                Top Routes
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                เส้นทางยอดนิยม{region.name}
              </h2>
            </div>
            <Link
              href="/#quick-planner"
              className="hidden items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 lg:flex"
            >
              ดูทั้งหมด <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {trips.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => {
                const photo = TRIP_PHOTOS[trip.slug] ?? FALLBACK
                return (
                  <div
                    key={trip.slug}
                    className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-44 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={trip.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
                        {trip.featured.tag}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {trip.featured.duration}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900">{trip.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-orange-400" />
                          {trip.distanceKm} กม.
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-400" />
                          {trip.featured.driveTime}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Wallet className="h-3 w-3 text-orange-400" />
                          {trip.featured.budgetLabel}
                        </span>
                      </div>
                      <Link
                        href={`/trip/${trip.slug}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
                      >
                        วางแผนทริปนี้ <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
              <p className="text-slate-400">ยังไม่มีเส้นทางสำเร็จรูปสำหรับภาคนี้</p>
              <Link
                href="/#quick-planner"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-500"
              >
                วางแผนเองได้เลย <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Recommended Stops ───────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Must-See
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            จุดแวะที่ไม่ควรพลาด
          </h2>

          {/* Horizontal scroll strip */}
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
            {region.stops.map((stop) => (
              <div
                key={stop.name}
                className="group relative w-48 shrink-0 overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stop.img}
                  alt={stop.name}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-base">{stop.emoji}</p>
                  <p className="mt-0.5 text-sm font-bold leading-tight text-white">{stop.name}</p>
                  <p className="text-[11px] text-white/60">{stop.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Province chips ──────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            จังหวัดใน{region.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {region.provinces.map((p) => (
              <Link
                key={p}
                href={`/#explore`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                📍 {p}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            พร้อมออกเดินทาง{region.name}แล้ว?
          </h2>
          <p className="mt-3 text-orange-100">
            เลือกต้นทาง เพิ่มจำนวนคน — รู้งบทันที ใช้เวลา 30 วินาที
          </p>
          <Link
            href="/#quick-planner"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-orange-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            ออกแบบเส้นทาง{region.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
      <StickyMobileCTA />
    </div>
  )
}
