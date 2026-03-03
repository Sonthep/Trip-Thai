"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Users, Car, CalendarDays } from "lucide-react"

const BUDGET_TIERS = [
  { key: "budget", label: "🟢 ประหยัด" },
  { key: "mid",    label: "🟡 ปานกลาง" },
  { key: "comfort",label: "🔴 สบาย" },
] as const
type BudgetTierKey = "budget" | "mid" | "comfort"

const CAR_OPTIONS = [
  { label: "รถ ECO (18 กม./ล.)", value: 18 },
  { label: "รถเก๋ง (15 กม./ล.)", value: 15 },
  { label: "รถ SUV (12 กม./ล.)", value: 12 },
  { label: "รถกระบะ (10 กม./ล.)", value: 10 },
]

type Props = {
  origin: string
  destination: string
  people: number
  kmPerLiter: number
  days: number
  places?: string
  budgetTier?: BudgetTierKey
}

export function CustomTripParamsEditor({ origin, destination, people, kmPerLiter, days, places, budgetTier = "mid" }: Props) {
  const router = useRouter()
  const [localPeople, setLocalPeople] = useState(people)
  const [localKmPerLiter, setLocalKmPerLiter] = useState(kmPerLiter)
  const [localTier, setLocalTier] = useState<BudgetTierKey>(budgetTier)
  const [localDays, setLocalDays] = useState(days)

  function apply(newPeople: number, newKpl: number, newTier: BudgetTierKey, newDays: number) {
    const params = new URLSearchParams({
      origin,
      destination,
      people: String(newPeople),
      kmPerLiter: String(newKpl),
      budgetTier: newTier,
      days: String(newDays),
      ...(places ? { places } : {}),
    })
    router.push(`/trip/custom?${params.toString()}`)
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      {/* People */}
      <div className="flex items-center gap-2">
        <Users className="h-3.5 w-3.5 shrink-0 text-white/40" />
        <label className="text-xs text-white/50">จำนวนคน</label>
        <select
          value={localPeople}
          onChange={(e) => {
            const v = Number(e.target.value)
            setLocalPeople(v)
            apply(v, localKmPerLiter, localTier, localDays)
          }}
          className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n} className="bg-slate-900">{n} คน</option>
          ))}
        </select>
      </div>

      <span className="hidden h-4 w-px bg-white/15 sm:block" />

      {/* Car type */}
      <div className="flex items-center gap-2">
        <Car className="h-3.5 w-3.5 shrink-0 text-white/40" />
        <label className="text-xs text-white/50">ประเภทรถ</label>
        <select
          value={localKmPerLiter}
          onChange={(e) => {
            const v = Number(e.target.value)
            setLocalKmPerLiter(v)
            apply(localPeople, v, localTier, localDays)
          }}
          className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          {CAR_OPTIONS.map((c) => (
            <option key={c.value} value={c.value} className="bg-slate-900">{c.label}</option>
          ))}
        </select>
      </div>

      <span className="hidden h-4 w-px bg-white/15 sm:block" />

      {/* Budget tier pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">ระดับงบ</span>
        <div className="flex gap-1">
          {BUDGET_TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setLocalTier(t.key)
                apply(localPeople, localKmPerLiter, t.key, localDays)
              }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                localTier === t.key
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <span className="hidden h-4 w-px bg-white/15 sm:block" />

      {/* Days */}
      <div className="flex items-center gap-2">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white/40" />
        <label className="text-xs text-white/50">จำนวนวัน</label>
        <select
          value={localDays}
          onChange={(e) => {
            const v = Number(e.target.value)
            setLocalDays(v)
            apply(localPeople, localKmPerLiter, localTier, v)
          }}
          className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <option key={n} value={n} className="bg-slate-900">{n} วัน {n > 0 ? `${n - 1} คืน` : ""}</option>
          ))}
        </select>
      </div>

      <span className="ml-auto text-[10px] text-white/25 flex items-center gap-1">
        ปรับแล้วหน้าอัปเดตอัตโนมัติ
      </span>
    </div>
  )
}
