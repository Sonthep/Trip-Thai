"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, MapPin, Users, Car } from "lucide-react"

const POPULAR_DESTINATIONS = [
  "เชียงใหม่", "ภูเก็ต", "กระบี่", "เขาใหญ่", "หัวหิน", "พัทยา", "เชียงราย",
]

const CAR_OPTIONS = [
  { label: "เก็ง", icon: "🚗", kpl: 15 },
  { label: "SUV",  icon: "🚙", kpl: 12 },
  { label: "กระบะ", icon: "🛳", kpl: 10 },
  { label: "ECO",  icon: "♻️", kpl: 18 },
]

const BUDGET_TIERS = [
  { key: "budget",  label: "🟢 ประหยัด" },
  { key: "mid",     label: "🟡 ปานกลาง" },
  { key: "comfort", label: "🔴 สบาย" },
] as const
type BudgetTierKey = "budget" | "mid" | "comfort"

export function HeroSearch() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [people, setPeople] = useState(2)
  const [carIdx, setCarIdx] = useState(1) // SUV default
  const [tier, setTier] = useState<BudgetTierKey>("mid")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    setLoading(true)
    const kpl = CAR_OPTIONS[carIdx].kpl
    router.push(
      `/trip/custom?origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}&people=${people}&kmPerLiter=${kpl}&budgetTier=${tier}`
    )
  }

  function setDest(dest: string) {
    setDestination(dest)
    if (!origin.trim()) setOrigin("กรุงเทพมหานคร")
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Row 1 — origin / destination */}
        <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/8 p-2 backdrop-blur-md sm:flex-row">
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="ออกจาก... (เช่น กรุงเทพ)"
              className="h-12 w-full rounded-xl bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:bg-white/10 focus:outline-none"
            />
          </div>
          <div className="hidden items-center sm:flex">
            <ArrowRight className="h-4 w-4 text-white/30" />
          </div>
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="ไปที่... (เช่น เชียงใหม่)"
              className="h-12 w-full rounded-xl bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:bg-white/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2 — options bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-2.5 backdrop-blur-md">
          {/* People */}
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-white/40" />
            <select
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs font-semibold text-white focus:outline-none"
            >
              {[1,2,3,4,5,6,7,8].map((n) => (
                <option key={n} value={n} className="bg-slate-900">{n} คน</option>
              ))}
            </select>
          </div>

          <span className="h-4 w-px bg-white/15" />

          {/* Car type */}
          <div className="flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 text-white/40" />
            <div className="flex gap-1">
              {CAR_OPTIONS.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCarIdx(i)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                    carIdx === i ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          <span className="h-4 w-px bg-white/15" />

          {/* Budget tier */}
          <div className="flex gap-1">
            {BUDGET_TIERS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTier(t.key)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  tier === t.key ? "bg-orange-500 text-white" : "bg-white/10 text-white/55 hover:bg-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !origin.trim() || !destination.trim()}
            className="ml-auto flex h-9 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <><span>คำนวณงบ</span><ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </form>

      {/* Popular quick-pick */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/35">ยอดนิยม:</span>
        {POPULAR_DESTINATIONS.map((dest) => (
          <button
            key={dest}
            type="button"
            onClick={() => setDest(dest)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:border-orange-400/50 hover:bg-orange-500/10 hover:text-orange-300"
          >
            {dest}
          </button>
        ))}
      </div>
    </div>
  )
}
