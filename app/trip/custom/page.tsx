import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  BedDouble,
  Car,
  Clock,
  Coins,
  Fuel,
  MapPin,
  Utensils,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TripBudgetChart } from "@/components/TripBudgetChart"
import { TripMapClient as TripMap } from "@/components/TripMapClient"
import type { TripMapWaypoint } from "@/components/TripMap"
import { calculateTrip } from "@/lib/calculateTrip"
import { getTouristPlacesByIds } from "@/lib/touristPlaces"
import { TRIPS } from "@/lib/trips"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const CATEGORY_EMOJI: Record<string, string> = {
  nature: "🌿",
  temple: "🛕",
  culture: "🎭",
  food: "🍜",
  beach: "🏖️",
  viewpoint: "🌅",
}

type Props = {
  searchParams: Promise<{
    origin?: string
    destination?: string
    people?: string
    kmPerLiter?: string
    /** Comma-separated tourist place IDs from the map explorer plan basket */
    places?: string
  }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const origin = sp.origin ?? "ต้นทาง"
  const destination = sp.destination ?? "ปลายทาง"
  return {
    title: `${origin} → ${destination} | TripThai`,
    description: `คำนวณงบและแผนทริปขับรถ ${origin} ไป ${destination}`,
    robots: { index: false },
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function CustomTripPage({ searchParams }: Props) {
  const sp = await searchParams
  const origin = sp.origin?.trim()
  const destination = sp.destination?.trim()

  if (!origin || !destination || origin === destination) notFound()

  const people = Math.max(1, Math.min(12, Number(sp.people) || 2))
  const kmPerLiter = Math.max(5, Math.min(30, Number(sp.kmPerLiter) || 12))
  const days = Math.max(1, Math.round(
    calculateTrip({ origin, destination, days: 1, people, kmPerLiter, fuelPrice: 42 }).distance_km / 350,
  ) + 1)

  const result = calculateTrip({
    origin,
    destination,
    days,
    people,
    kmPerLiter,
    fuelPrice: 42,
  })

  // ── Tourist-place waypoints from plan basket ──────────────────────────
  const planPlaces = sp.places
    ? getTouristPlacesByIds(sp.places.split(",").map((s) => s.trim()).filter(Boolean))
    : []
  // Preserve the order from the URL param
  const orderedPlanPlaces = sp.places
    ? sp.places.split(",").map((id) => planPlaces.find((p) => p.id === id)).filter(Boolean)
    : []
  const waypoints: TripMapWaypoint[] = orderedPlanPlaces.map((place, i) => ({
    position: place!.location,
    label: place!.name,
    index: i + 1,
    category: place!.category,
  }))

  // Use real place coordinates for origin/destination if available
  const firstPlace = orderedPlanPlaces[0]
  const lastPlace = orderedPlanPlaces[orderedPlanPlaces.length - 1]
  const originPos = firstPlace?.location ?? { lat: 13.7563, lng: 100.5018 }
  const destPos = lastPlace?.location ?? { lat: 13.7563, lng: 100.5018 }

  const lo = Math.round((result.total_cost * 0.85) / 100) * 100
  const hi = Math.round((result.total_cost * 1.2) / 100) * 100

  const budgetData = [
    { key: "fuel" as const, name: "ค่าน้ำมัน", value: result.fuel_cost },
    { key: "toll" as const, name: "ค่าทางด่วน", value: result.toll_cost },
    { key: "food" as const, name: "ค่าอาหาร", value: result.food_cost },
    { key: "accommodation" as const, name: "ค่าที่พัก", value: result.accommodation_cost },
  ]

  const relatedTrips = TRIPS.filter(
    (t) =>
      t.from === origin ||
      t.to === destination ||
      t.from === destination ||
      t.to === origin
  ).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="print:hidden"><Navbar /></div>

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="hover:text-white">หน้าหลัก</Link>
            <span>/</span>
            <Link href="/#quick-planner" className="hover:text-white">Quick Planner</Link>
            <span>/</span>
            <span className="text-white/70">{origin} → {destination}</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300 ring-1 ring-orange-500/40 mb-4">
            <Car className="h-3 w-3" /> ประมาณการทริปขับรถ
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {origin} → {destination}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" />{result.duration_hours} ชม.
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 rounded-full border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200 backdrop-blur-sm">
              <Coins className="h-3.5 w-3.5" />฿{lo.toLocaleString("th-TH")} – {hi.toLocaleString("th-TH")}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 rounded-full border-sky-400/40 bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-200 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />{result.distance_km} กม.
            </Badge>
          </div>
          <p className="mt-4 text-sm text-white/50">
            ประมาณการสำหรับ {people} คน · {days} วัน · รถ {kmPerLiter} กม./ล.
            <span className="ml-2 italic text-white/30">(ตัวเลขคือการประมาณเบื้องต้น)</span>
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 md:px-6">

        {/* Budget Summary */}
        <section>
          <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/30">
            <CardHeader className="pb-3">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">งบประมาณรวมโดยประมาณ</p>
              <CardTitle className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                {formatCurrency(result.total_cost)}
              </CardTitle>
              <p className="mt-1 text-[11px] text-white/55">
                ช่วงประมาณ ฿{lo.toLocaleString("th-TH")} – ฿{hi.toLocaleString("th-TH")}
                ({people} คน · {days} วัน)
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs text-white/75 sm:grid-cols-4">
              {[
                { icon: Fuel, color: "text-amber-400", label: "ค่าน้ำมัน", value: result.fuel_cost },
                { icon: Coins, color: "text-sky-400", label: "ค่าทางด่วน", value: result.toll_cost },
                { icon: Utensils, color: "text-emerald-400", label: "ค่าอาหาร", value: result.food_cost },
                { icon: BedDouble, color: "text-violet-400", label: "ค่าที่พัก", value: result.accommodation_cost },
              ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="rounded-xl border border-white/8 bg-white/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    <span>{label}</span>
                  </div>
                  <p className="font-semibold text-white text-sm">{formatCurrency(value)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Budget breakdown + pie chart */}
        <section className="grid gap-6 md:grid-cols-[3fr,2fr] md:items-stretch">
          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Coins className="h-4 w-4 text-amber-400" />
                รายละเอียดงบประมาณ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-white/75">
              {budgetData.map((item) => {
                const pct = result.total_cost ? (item.value / result.total_cost) * 100 : 0
                const cls =
                  item.key === "fuel" ? "bg-amber-400" :
                  item.key === "toll" ? "bg-sky-400" :
                  item.key === "food" ? "bg-emerald-400" : "bg-violet-400"
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{formatCurrency(item.value)}</p>
                        <p className="text-[11px] text-white/55">{pct.toFixed(0)}% ของงบรวม</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full ${cls}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">สัดส่วนงบประมาณ (กราฟ)</CardTitle>
            </CardHeader>
            <CardContent>
              <TripBudgetChart data={budgetData} />
            </CardContent>
          </Card>
        </section>

        {/* Route segments */}
        {result.segments.length > 1 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <MapPin className="h-4 w-4 text-sky-400" />
              เส้นทางทีละช่วง
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80">
              {result.segments.map((seg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 border-b border-white/5 px-4 py-3 text-xs last:border-0"
                >
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/80 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span>{seg.from}</span>
                    <ArrowRight className="h-3 w-3 text-white/30" />
                    <span>{seg.to}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-white/50">
                    <span>{seg.distance_km} กม.</span>
                    <span className="h-3 w-px bg-white/15" />
                    <span>{seg.duration_hours} ชม.</span>
                    {seg.toll_cost > 0 && (
                      <>
                        <span className="h-3 w-px bg-white/15" />
                        <span className="text-sky-300">ด่าน ฿{seg.toll_cost}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Tourist places from plan basket ── */}
        {orderedPlanPlaces.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <MapPin className="h-4 w-4 text-orange-400" />
              สถานที่ที่เลือกไว้ ({orderedPlanPlaces.length} แห่ง)
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {orderedPlanPlaces.map((place, i) => (
                <div key={place!.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {CATEGORY_EMOJI[place!.category] ?? "📍"} {place!.name}
                    </p>
                    <p className="text-[10px] text-white/40">{place!.province}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Map with plan basket waypoints ── */}
        <section className="space-y-4 print:hidden">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
            <MapPin className="h-4 w-4 text-sky-400" />
            แผนที่เส้นทาง
            {waypoints.length > 0 && (
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-medium text-orange-300 ring-1 ring-orange-500/30">
                {waypoints.length} จุดแวะ
              </span>
            )}
          </h2>
          <TripMap
            origin={{ position: originPos, label: origin }}
            destination={{ position: destPos, label: destination }}
            distanceKm={result.distance_km}
            durationHours={result.duration_hours}
            fuelCost={result.fuel_cost}
            waypoints={waypoints}
          />
        </section>

        {/* Related pre-built trips */}
        {relatedTrips.length > 0 && (
          <section className="space-y-4 print:hidden">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
              <Car className="h-4 w-4 text-orange-400" />
              ทริปยอดนิยมใกล้เคียง
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/trip/${rt.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-slate-900/80 p-4 transition-all hover:border-orange-500/40 hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-white text-sm leading-snug">{rt.name}</p>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-white/70">
                      <Clock className="h-3 w-3" />{rt.durationLabel.split(" ").slice(0, 3).join(" ")}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-amber-200">
                      <Coins className="h-3 w-3" />
                      {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(rt.budget.total)}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-white/50">{rt.distanceKm} กม. · {rt.itinerary.length} วัน · มีแผนวันต่อวัน</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <section className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs text-white/70 md:flex md:items-center md:justify-between md:gap-6">
          <div className="mb-3 space-y-1 md:mb-0">
            <p className="text-sm font-semibold text-white">อยากได้แผนวันต่อวันพร้อมสถานที่ท่องเที่ยว?</p>
            <p className="text-[11px] text-white/50">ลองสำรวจทริปยอดนิยมที่มีแผนครบ หรือกลับไปปรับต้นทาง-ปลายทางใหม่</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#quick-planner"
              className="flex items-center gap-2 rounded-xl border border-orange-500/50 px-4 py-2 text-sm font-semibold text-orange-300 hover:bg-orange-500/10"
            >
              ปรับแผนใหม่
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
            >
              สำรวจทริปยอดนิยม <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      <div className="print:hidden"><Footer /></div>
    </div>
  )
}
