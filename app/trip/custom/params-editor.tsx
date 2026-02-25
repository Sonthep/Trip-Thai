"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Users, Car, RotateCcw } from "lucide-react"

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
  places?: string
}

export function CustomTripParamsEditor({ origin, destination, people, kmPerLiter, places }: Props) {
  const router = useRouter()
  const [localPeople, setLocalPeople] = useState(people)
  const [localKmPerLiter, setLocalKmPerLiter] = useState(kmPerLiter)

  function apply(newPeople: number, newKpl: number) {
    const params = new URLSearchParams({
      origin,
      destination,
      people: String(newPeople),
      kmPerLiter: String(newKpl),
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
            apply(v, localKmPerLiter)
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
            apply(localPeople, v)
          }}
          className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          {CAR_OPTIONS.map((c) => (
            <option key={c.value} value={c.value} className="bg-slate-900">{c.label}</option>
          ))}
        </select>
      </div>

      <span className="ml-auto text-[10px] text-white/25 flex items-center gap-1">
        <RotateCcw className="h-3 w-3" /> ปรับแล้วหน้าอัปเดตอัตโนมัติ
      </span>
    </div>
  )
}
