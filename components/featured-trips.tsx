"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Clock, MapPin, Star, Wallet } from "lucide-react"
import { getFeaturedTrips } from "@/lib/trips"

type Season = "cool" | "hot" | "rainy" | "all"

const TRIP_SEASON: Record<string, Season> = {
  "bangkok-chiang-mai": "cool",
  "bangkok-phuket": "cool",
  "bangkok-khao-yai": "cool",
  "bangkok-hua-hin": "hot",
  "bangkok-kanchanaburi": "rainy",
  "bangkok-ayutthaya": "hot",
  "bangkok-pattaya": "hot",
}

const SEASON_BADGE: Record<Season, { label: string; cls: string } | undefined> = {
  cool:  { label: "❄️ พ.ย.–ก.พ.", cls: "bg-sky-100 text-sky-700" },
  hot:   { label: "☀️ มี.ค.–พ.ค.", cls: "bg-amber-100 text-amber-700" },
  rainy: { label: "🌧 มิ.ย.–ต.ค.", cls: "bg-emerald-100 text-emerald-700" },
  all:   undefined,
}

const SEASON_FILTERS = [
  { label: "ทุกฤดู", value: "all" as Season },
  { label: "❄️ หน้าหนาว", value: "cool" as Season },
  { label: "☀️ หน้าร้อน", value: "hot" as Season },
  { label: "🌧 หน้าฝน", value: "rainy" as Season },
]

const TRIP_PHOTOS: Record<string, string> = {
  "bangkok-chiang-mai":    "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=75",
  "bangkok-chiang-rai":    "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800&q=75",
  "bangkok-phuket":        "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=75",
  "bangkok-krabi":         "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=75",
  "bangkok-hua-hin":       "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=75",
  "bangkok-pattaya":       "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=75",
  "bangkok-ayutthaya":     "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=75",
  "bangkok-kanchanaburi":  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75",
  "bangkok-khao-yai":      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75",
  "chiang-mai-pai":        "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=75",
  "phuket-krabi":          "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=75",
  "bangkok-nakhon-ratchasima": "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=75",
  "bangkok-udon-thani":    "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=75",
}

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=800&q=75"

const FILTERS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "🏔️ ภาคเหนือ", value: "north" },
  { label: "🏖️ ภาคใต้", value: "south" },
  { label: "🏛️ ภาคกลาง", value: "central" },
  { label: "⚡ Day Trip", value: "day" },
]

const TAG_REGION: Record<string, string> = {
  "Long Trip": "north",
  "Beach Paradise": "south",
  Popular: "central",
  "Day Trip": "day",
  "Family Friendly": "central",
  "Quick Escape": "central",
}

export function FeaturedTrips() {
  const trips = getFeaturedTrips()
  const [active, setActive] = useState("all")
  const [activeSeason, setActiveSeason] = useState<Season>("all")

  const filtered = trips
    .filter((t) => active === "all" || TAG_REGION[t.featured.tag] === active)
    .filter((t) => activeSeason === "all" || TRIP_SEASON[t.slug] === activeSeason)

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Featured Road Trips
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            ทริปยอดนิยม
          </h2>
          <p className="mt-4 text-slate-500">
            เส้นทางที่คนนิยมเดินทางมากที่สุด พร้อมงบประมาณจริงทุกทริป
          </p>
        </div>

        {/* Unified filter bar */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {/* Region group */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ภาค</span>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActive(f.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  active === f.value
                    ? "scale-105 bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white text-slate-600 shadow-sm hover:shadow-md hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <span className="hidden h-5 w-px bg-slate-200 sm:block" />

          {/* Season group */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ฤดู</span>
            {SEASON_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActiveSeason(f.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeSeason === f.value
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 shadow-sm hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trip) => {
            const photo = TRIP_PHOTOS[trip.slug] ?? FALLBACK_PHOTO
            return (
              <div
                key={trip.slug}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                    <Image
                    src={photo}
                    alt={trip.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Tag badge */}
                  <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    {trip.featured.tag}
                  </span>

                  {/* Season badge */}
                  {SEASON_BADGE[TRIP_SEASON[trip.slug] ?? "all"] && (
                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      SEASON_BADGE[TRIP_SEASON[trip.slug] ?? "all"]!.cls
                    }`}>
                      {SEASON_BADGE[TRIP_SEASON[trip.slug] ?? "all"]!.label}
                    </span>
                  )}

                  {/* Fake rating for social proof */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.{(trip.distanceKm % 3) + 7}</span>
                  </div>

                  {/* Duration overlay */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {trip.featured.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">{trip.name}</h3>

                  <div className="mt-3 grid grid-cols-2 gap-y-2">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                      {trip.distanceKm} km
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                      {trip.featured.driveTime}
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                      <Wallet className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                      {trip.featured.budgetLabel}
                    </div>
                  </div>

                  {/* Budget bar */}
                  <div className="mt-4">
                    <p className="mb-1.5 text-xs text-slate-400">สัดส่วนค่าใช้จ่าย</p>
                    <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
                      <div
                        className="rounded-full bg-orange-400"
                        style={{ width: `${trip.featured.breakdown.fuel}%` }}
                      />
                      <div
                        className="rounded-full bg-emerald-400"
                        style={{ width: `${trip.featured.breakdown.food}%` }}
                      />
                      <div
                        className="rounded-full bg-sky-400"
                        style={{ width: `${trip.featured.breakdown.stay}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                        น้ำมัน {trip.featured.breakdown.fuel}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                        อาหาร {trip.featured.breakdown.food}%
                      </span>
                      {trip.featured.breakdown.stay > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                          ที่พัก {trip.featured.breakdown.stay}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/trip/${trip.slug}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    วางแผนทริปนี้
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* View all */}
        <div className="mt-12 text-center">
          <Link
            href="/trip/bangkok-chiang-mai"
            className="inline-flex items-center gap-2 rounded-full border-2 border-orange-500 px-8 py-3 text-sm font-semibold text-orange-500 transition-all duration-200 hover:bg-orange-500 hover:text-white"
          >
            ดูทริปทั้งหมด
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
