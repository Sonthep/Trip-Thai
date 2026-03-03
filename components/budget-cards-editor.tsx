"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Car, Utensils, BedDouble, Pencil, Check } from "lucide-react"

type Props = {
  origin: string
  destination: string
  people: number
  kmPerLiter: number
  places?: string
  budgetTier: string
  foodPerDay: number
  accommodationPerNight: number
  travelCost: number
  travelCostOverride?: number
  foodCost: number
  accommodationCost: number
  tripDays: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount)
}

function EditableAmount({
  value,
  color,
  onCommit,
}: {
  value: number
  color: string
  onCommit: (v: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  function open() {
    setDraft(String(value))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commit() {
    const n = parseInt(draft, 10)
    if (Number.isFinite(n) && n >= 0) onCommit(n)
    setEditing(false)
  }

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1">
        ฿
        <input
          ref={inputRef}
          type="number"
          min={0}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") setEditing(false)
          }}
          className="w-24 rounded border border-orange-400/60 bg-slate-800 px-1.5 py-0.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <button
          onMouseDown={(e) => { e.preventDefault(); commit() }}
          className="rounded p-0.5 text-orange-400 hover:bg-orange-400/10"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={open}
      className={`inline-flex items-center gap-1 rounded-md px-1 py-0.5 font-bold text-sm ${color} transition hover:opacity-70`}
    >
      {formatCurrency(value)}
      <Pencil className="h-2.5 w-2.5 opacity-40" />
    </button>
  )
}

export function BudgetCardsEditor({
  origin, destination, people, kmPerLiter, places, budgetTier,
  foodPerDay, accommodationPerNight,
  travelCost, travelCostOverride, foodCost, accommodationCost,
  tripDays,
}: Props) {
  const router = useRouter()

  function pushUpdate(params: { travel?: number; food?: number; accom?: number }) {
    const searchParams = new URLSearchParams({
      origin,
      destination,
      people: String(people),
      kmPerLiter: String(kmPerLiter),
      budgetTier,
      foodPerDay: String(params.food ?? foodPerDay),
      accommodationPerNight: String(params.accom ?? accommodationPerNight),
      ...(params.travel !== undefined
        ? { travelCost: String(params.travel) }
        : travelCostOverride !== undefined
        ? { travelCost: String(travelCostOverride) }
        : {}),
      ...(places ? { places } : {}),
    })
    router.push(`/trip/custom?${searchParams.toString()}`)
  }

  const cards = [
    {
      key: "travel",
      icon: Car,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      label: "ค่าเดินทาง",
      value: travelCost,
      onCommit: (v: number) => pushUpdate({ travel: v }),
    },
    {
      key: "food",
      icon: Utensils,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      label: "ค่าอาหาร",
      value: foodCost,
      onCommit: (v: number) =>
        pushUpdate({ food: Math.max(1, Math.round(v / Math.max(people, 1) / Math.max(tripDays, 1))) }),
    },
    {
      key: "accommodation",
      icon: BedDouble,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      label: "ค่าที่พัก",
      value: accommodationCost,
      onCommit: (v: number) =>
        pushUpdate({ accom: Math.max(1, Math.round(v / Math.max(tripDays, 1))) }),
    },
  ].filter((c) => c.key === "accommodation" || c.value > 0)

  return (
    <div className="grid grid-cols-3 gap-3 text-xs text-white/75">
      {cards.map(({ key, icon: Icon, color, bg, label, value, onCommit }) => (
        <div key={key} className={`rounded-xl border border-white/8 ${bg} p-3`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
            <span>{label}</span>
          </div>
          <EditableAmount value={value} color={color} onCommit={onCommit} />
        </div>
      ))}
    </div>
  )
}
