"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import type { TripDetail } from "@/lib/trips"

type Props = {
  trip: Pick<TripDetail, "name" | "from" | "to" | "distanceKm" | "durationLabel" | "budgetRangeLabel" | "itinerary">
}

export function CopyItineraryButton({ trip }: Props) {
  const [copied, setCopied] = useState(false)

  function buildText() {
    const lines: string[] = []
    lines.push(`🗺️ แผนทริป: ${trip.name}`)
    lines.push(`📍 เส้นทาง: ${trip.from} → ${trip.to}`)
    lines.push(`🚗 ระยะทาง: ${trip.distanceKm} กม. | ⏱️ ${trip.durationLabel}`)
    lines.push(`💰 งบประมาณโดยประมาณ: ${trip.budgetRangeLabel}`)
    lines.push("")
    for (const day of trip.itinerary) {
      lines.push(`📅 Day ${day.day}: ${day.title}`)
      for (const item of day.items) {
        lines.push(`  • ${item}`)
      }
      lines.push("")
    }
    lines.push("— สร้างโดย TripThai (tripthai.vercel.app)")
    return lines.join("\n")
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // clipboard API not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-white/70 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200 print:hidden"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          คัดลอกแล้ว!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          คัดลอกแผนเที่ยว
        </>
      )}
    </button>
  )
}
