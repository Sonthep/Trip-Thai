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
  foodCost: number
  accommodationCost: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount)
}

function EditableRateField({
  value,
  onCommit,
  suffix,
}: {
  value: number
  onCommit: (v: number) => void
  suffix: string
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
    if (Number.isFinite(n) && n > 0) onCommit(n)
    setEditing(false)
  }

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1">
        ฿
        <input
          ref={inputRef}
          type="number"
          min={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") setEditing(false)
          }}
          className="w-20 rounded border border-orange-400/60 bg-slate-800 px-1.5 py-0.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        {suffix}
        <button
          onMouseDown={(e) => { e.preventDefault(); commit() }}
          className="ml-0.5 rounded p-0.5 text-orange-400 hover:bg-orange-400/10"
        >
          <Check className="h-3 w-3" />
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={open}
      className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      ฿{value.toLocaleString("th-TH")}{suffix}
      <Pencil className="h-2.5 w-2.5 opacity-50" />
    </button>
  )
}

export function BudgetCardsEditor({
  origin, destination, people, kmPerLiter, places, budgetTier,
  foodPerDay, accommodationPerNight,
  travelCost, foodCost, accommodationCost,
}: Props) {
  const router = useRouter()

  function pushUpdate(newFoodPerDay: number, newAccomPerNight: number) {
    const params = new URLSearchParams({
      origin,
      destination,
      people: String(people),
      kmPerLiter: String(kmPerLiter),
      budgetTier,
      foodPerDay: String(newFoodPerDay),
      accommodationPerNight: String(newAccomPerNight),
      ...(places ? { places } : {}),
    })
    router.push(`/trip/custom?${params.toString()}`)
  }

  const cards = [
    {
      icon: Car,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      label: <span>ค่าเดินทาง</span>,
      value: travelCost,
    },
    {
      icon: Utensils,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      label: (
        <span className="flex flex-wrap items-center gap-0.5">
          ค่าอาหาร&nbsp;
          <EditableRateField
            value={foodPerDay}
            suffix="/คน/วัน"
            onCommit={(v) => pushUpdate(v, accommodationPerNight)}
          />
        </span>
      ),
      value: foodCost,
    },
    {
      icon: BedDouble,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      label: (
        <span className="flex flex-wrap items-center gap-0.5">
          ค่าที่พัก&nbsp;
          <EditableRateField
            value={accommodationPerNight}
            suffix="/คืน"
            onCommit={(v) => pushUpdate(foodPerDay, v)}
          />
        </span>
      ),
      value: accommodationCost,
    },
  ].filter((c) => c.value > 0)

  return (
    <div className="grid grid-cols-3 gap-3 text-xs text-white/75">
      {cards.map(({ icon: Icon, color, bg, label, value }) => (
        <div key={String(label)} className={`rounded-xl border border-white/8 ${bg} p-3`}>
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
            <span>{label}</span>
          </div>
          <p className={`font-bold text-sm ${color}`}>{formatCurrency(value)}</p>
        </div>
      ))}
    </div>
  )
}
