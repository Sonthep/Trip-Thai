"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeftRight, ChevronDown, Fuel, UtensilsCrossed, BedDouble, Route } from "lucide-react"
import { TRIPS } from "@/lib/trips"

type TransportType = {
  label: string
  icon: string
  mode: "car" | "ev" | "transit"
  // car: total fuel shared by passengers
  kmPerLiter?: number
  // ev: total electricity cost shared by passengers (บ./กม. total)
  costPerKmTotal?: number
  // transit: per-person ticket cost (บ./กม./คน)
  costPerKmPerPerson?: number
  transportLabel: string // "น้ำมัน" | "ค่าไฟ" | "ค่าโดยสาร"
}

const TRANSPORT_TYPES: TransportType[] = [
  { label: "รถเก๋ง",      icon: "🚗", mode: "car",     kmPerLiter: 15,           transportLabel: "น้ำมัน" },
  { label: "รถ SUV/PPV",  icon: "🚙", mode: "car",     kmPerLiter: 12,           transportLabel: "น้ำมัน" },
  { label: "รถกระบะ",     icon: "🛻", mode: "car",     kmPerLiter: 10,           transportLabel: "น้ำมัน" },
  { label: "Eco Car",     icon: "♻️", mode: "car",     kmPerLiter: 18,           transportLabel: "น้ำมัน" },
  { label: "รถ EV",       icon: "⚡", mode: "ev",      costPerKmTotal: 3.5,      transportLabel: "ค่าไฟ" },
  { label: "รถทัวร์",     icon: "🚌", mode: "transit", costPerKmPerPerson: 0.70, transportLabel: "ค่าโดยสาร" },
  { label: "รถไฟ",        icon: "🚂", mode: "transit", costPerKmPerPerson: 0.50, transportLabel: "ค่าโดยสาร" },
  { label: "เครื่องบิน",  icon: "✈️", mode: "transit", costPerKmPerPerson: 3.50, transportLabel: "ค่าโดยสาร" },
]

const FUEL_PRICE = 42 // THB per liter
const FOOD_PER_PERSON_PER_DAY = 350
const STAY_PER_NIGHT = 700

function calcTransportCost(t: TransportType, distanceKm: number, people: number): number {
  if (t.mode === "car") return Math.round((distanceKm / t.kmPerLiter!) * FUEL_PRICE)
  if (t.mode === "ev")  return Math.round(distanceKm * t.costPerKmTotal!)
  // transit: per person × people
  return Math.round(distanceKm * t.costPerKmPerPerson! * people)
}

// Extract unique cities
function getUniqueCities(): string[] {
  const set = new Set<string>()
  for (const t of TRIPS) {
    set.add(t.from)
    set.add(t.to)
  }
  return Array.from(set).sort((a, b) => {
    // Put กรุงเทพ first
    if (a === "กรุงเทพ") return -1
    if (b === "กรุงเทพ") return 1
    return a.localeCompare(b, "th")
  })
}

const CITIES = getUniqueCities()

export function QuickPlanner() {
  const router = useRouter()
  const [from, setFrom] = useState("กรุงเทพ")
  const [to, setTo] = useState("")
  const [people, setPeople] = useState(2)
  const [transportIdx, setTransportIdx] = useState(0)

  // Pre-fill from URL params: /?from=X&to=Y#quick-planner
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paramFrom = params.get("from")
    const paramTo = params.get("to")
    if (paramFrom && CITIES.includes(paramFrom)) setFrom(paramFrom)
    if (paramTo && CITIES.includes(paramTo)) setTo(paramTo)
  }, [])

  const transport = TRANSPORT_TYPES[transportIdx]

  // Find matching trip or estimate
  const estimate = useMemo(() => {
    if (!from || !to || from === to) return null

    const matched = TRIPS.find(
      (t) =>
        (t.from === from && t.to === to) ||
        (t.from === to && t.to === from)
    )

    if (matched) {
      const days = matched.itinerary.length || 2
      const nights = Math.max(days - 1, 1)
      const transportCost = calcTransportCost(transport, matched.distanceKm * 2, people)
      const foodCost = FOOD_PER_PERSON_PER_DAY * people * days
      const stayCost = STAY_PER_NIGHT * nights
      const total = transportCost + foodCost + stayCost + matched.budget.toll
      const lo = Math.round(total * 0.85 / 100) * 100
      const hi = Math.round(total * 1.20 / 100) * 100
      return {
        distanceKm: matched.distanceKm,
        durationHours: matched.durationHours,
        days,
        transportCost: Math.round(transportCost),
        foodCost: Math.round(foodCost),
        stayCost: Math.round(stayCost),
        lo,
        hi,
        slug: matched.slug,
      }
    }

    // Generic estimate
    const destTrip = TRIPS.find((t) => t.to === to || t.from === to)
    const distanceKm = destTrip?.distanceKm ?? 400
    const days = distanceKm > 500 ? 3 : distanceKm > 200 ? 2 : 1
    const nights = Math.max(days - 1, 0)
    const transportCost = calcTransportCost(transport, distanceKm * 2, people)
    const foodCost = FOOD_PER_PERSON_PER_DAY * people * days
    const stayCost = STAY_PER_NIGHT * nights
    const total = transportCost + foodCost + stayCost
    const lo = Math.round(total * 0.85 / 100) * 100
    const hi = Math.round(total * 1.20 / 100) * 100
    return {
      distanceKm: Math.round(distanceKm),
      durationHours: Math.round(distanceKm / 70 * 10) / 10,
      days,
      transportCost,
      foodCost,
      stayCost,
      lo,
      hi,
      slug: null,
    }
  }, [from, to, people, transport])

  function handlePlan() {
    if (estimate?.slug) {
      router.push(`/trip/${estimate.slug}`)
    } else if (from && to) {
      const kmPerLiter = transport.mode === "car" ? transport.kmPerLiter! :
                         transport.mode === "ev"  ? Math.round(FUEL_PRICE / transport.costPerKmTotal!) : 12
      router.push(
        `/trip/custom?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&people=${people}&kmPerLiter=${kmPerLiter}`
      )
    }
  }

  const hasResult = estimate !== null

  return (
    <section id="quick-planner" className="bg-orange-50 py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Quick Planner
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            วางแผนทริปใหม่ ใช้เวลา 30 วินาที
          </h2>
          <p className="mt-2 text-slate-500">ลองใส่ต้นทาง-ปลายทาง — งบจะโชว์เลย</p>
        </div>

        {/* Input row */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-md shadow-orange-100/50 lg:p-6">
          <div className="flex flex-wrap items-end gap-3">
            {/* From */}
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                จากเมือง
              </label>
              <div className="relative">
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-9 text-sm font-medium text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                >
                  <option value="">เลือกต้นทาง</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Swap button */}
            <button
              type="button"
              onClick={() => { const tmp = from; setFrom(to); setTo(tmp) }}
              title="สลับต้นทาง-ปลายทาง"
              className="mb-px flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-500 active:scale-95"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            {/* To */}
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                ถึงเมือง
              </label>
              <div className="relative">
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-9 text-sm font-medium text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                >
                  <option value="">เลือกปลายทาง</option>
                  {CITIES.filter((c) => c !== from).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* People */}
            <div className="flex-1 min-w-[120px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                จำนวนคน
              </label>
              <div className="relative">
                <select
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-9 text-sm font-medium text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} คน</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Transport type */}
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                การเดินทาง
              </label>
              <div className="relative">
                <select
                  value={transportIdx}
                  onChange={(e) => setTransportIdx(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-9 text-sm font-medium text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                >
                  {TRANSPORT_TYPES.map((t, i) => (
                    <option key={i} value={i}>{t.icon} {t.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Live Budget Preview */}
          <div
            className={`mt-4 overflow-hidden rounded-xl transition-all duration-300 ${
              hasResult
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {estimate && (
              <div className="border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                {/* Route meta */}
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Route className="h-3.5 w-3.5 text-orange-500" />
                    {estimate.distanceKm.toLocaleString("th-TH")} กม.
                  </span>
                  <span className="h-3 w-px bg-slate-300" />
                  <span>🕐 {estimate.durationHours} ชม.</span>
                  <span className="h-3 w-px bg-slate-300" />
                  <span>📅 {estimate.days} วัน {Math.max(estimate.days - 1, 0)} คืน</span>
                  <span className="h-3 w-px bg-slate-300" />
                  <span>👥 {people} คน</span>
                </div>

                {/* Cost breakdown */}
                <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg bg-white/80 px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                      <Fuel className="h-3 w-3 text-orange-400" /> {transport.transportLabel}
                    </div>
                    <div className="mt-0.5 font-bold text-slate-900">
                      ฿{estimate.transportCost.toLocaleString("th-TH")}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/80 px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                      <UtensilsCrossed className="h-3 w-3 text-emerald-500" /> อาหาร
                    </div>
                    <div className="mt-0.5 font-bold text-slate-900">
                      ฿{estimate.foodCost.toLocaleString("th-TH")}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/80 px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                      <BedDouble className="h-3 w-3 text-sky-500" /> ที่พัก
                    </div>
                    <div className="mt-0.5 font-bold text-slate-900">
                      ฿{estimate.stayCost.toLocaleString("th-TH")}
                    </div>
                  </div>
                </div>

                {/* Total range + CTA */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">งบรวมประมาณ</p>
                    <p className="text-xl font-bold text-slate-900">
                      ฿{estimate.lo.toLocaleString("th-TH")}
                      <span className="mx-1 text-slate-400">–</span>
                      {estimate.hi.toLocaleString("th-TH")}
                    </p>
                    <p className="text-xs text-slate-400">
                      ({people} คน · {estimate.days} วัน)
                    </p>
                  </div>
                  {(estimate.slug || transport.mode !== "transit") ? (
                    <button
                      onClick={handlePlan}
                      className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 active:translate-y-0"
                    >
                      {estimate?.slug ? "ดูแผนเต็ม + วันต่อวัน" : "ดูรายละเอียด"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <p className="text-xs text-slate-400 text-right max-w-[140px]">
                      💡 ค่าโดยสารโดยประมาณ<br />ขึ้นอยู่กับระยะทางและชั้น
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Empty state */}
          {!hasResult && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-5 text-sm text-slate-400">
              <span>👆</span>
              <span>เลือกต้นทางและปลายทาง แล้วงบจะโชว์อัตโนมัติ</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
