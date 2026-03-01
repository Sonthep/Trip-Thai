"use client"

import { useState, useRef } from "react"
import { Car, Utensils, BedDouble, Pencil, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  initialTravel: number
  initialFood: number
  initialAccommodation: number
  durationLabel: string
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n)
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

export function SlugBudgetCards({ initialTravel, initialFood, initialAccommodation, durationLabel }: Props) {
  const [travel, setTravel] = useState(initialTravel)
  const [food, setFood] = useState(initialFood)
  const [accommodation, setAccommodation] = useState(initialAccommodation)

  const total = travel + food + accommodation

  const cards = [
    { key: "travel", icon: Car, color: "text-amber-400", bg: "bg-amber-400/10", label: "ค่าเดินทาง", value: travel, onCommit: setTravel },
    { key: "food", icon: Utensils, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "ค่าอาหาร", value: food, onCommit: setFood },
    { key: "accommodation", icon: BedDouble, color: "text-violet-400", bg: "bg-violet-400/10", label: "ค่าที่พัก", value: accommodation, onCommit: setAccommodation },
  ]

  return (
    <Card className="border-white/10 bg-slate-900/80 shadow-xl shadow-black/30">
      <CardHeader className="pb-3">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">งบประมาณรวมสำหรับทั้งทริป</p>
        <CardTitle className="mt-2 text-2xl font-semibold text-white md:text-3xl">
          {formatCurrency(total)}
        </CardTitle>
        <p className="mt-1 text-[11px] text-white/55">{durationLabel}</p>
        <p className="text-[10px] text-white/30 mt-0.5">คลิกตัวเลขเพื่อปรับงบ</p>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 text-xs text-white/75">
        {cards.map(({ key, icon: Icon, color, bg, label, value, onCommit }) => (
          <div key={key} className={`rounded-xl border border-white/8 ${bg} p-3`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span>{label}</span>
            </div>
            <EditableAmount value={value} color={color} onCommit={onCommit} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
