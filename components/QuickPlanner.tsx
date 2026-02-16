"use client"

import { useState } from "react"
import { MapPin, Calendar, Users, Gauge, Fuel, Search, Sparkles, CircleAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TripResult } from "@/components/TripResult"
import type { TripCalculationResult } from "@/lib/calculateTrip"

type PlannerFormState = {
  origin: string
  destination: string
  days: string
  people: string
  kmPerLiter: string
  fuelPrice: string
}

const DEFAULT_FORM: PlannerFormState = {
  origin: "กรุงเทพ",
  destination: "เชียงใหม่",
  days: "3",
  people: "2",
  kmPerLiter: "14",
  fuelPrice: "38",
}

export function QuickPlanner() {
  const [form, setForm] = useState<PlannerFormState>(DEFAULT_FORM)
  const [result, setResult] = useState<TripCalculationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange =
    (field: keyof PlannerFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const payload = {
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        days: Number(form.days) || 1,
        people: Number(form.people) || 1,
        kmPerLiter: Number(form.kmPerLiter) || 12,
        fuelPrice: Number(form.fuelPrice) || 38,
      }

      const response = await fetch("/api/calculate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("ไม่สามารถคำนวณทริปได้ กรุณาลองใหม่อีกครั้ง")
      }

      const data = (await response.json()) as TripCalculationResult
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card className="border-white/[0.08] bg-white/[0.07] shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
              <Sparkles className="h-4 w-4 text-[hsl(24,90%,60%)]" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">Quick Planner</span>
              <span className="block text-[11px] text-white/60">คำนวณระยะทางและงบประมาณทั้งทริปในไม่กี่วินาที</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                  <MapPin className="h-3 w-3" />
                  {"จุดเริ่มต้น"}
                </label>
                <Input
                  value={form.origin}
                  onChange={handleChange("origin")}
                  placeholder="กรุงเทพ"
                  className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                  <MapPin className="h-3 w-3" />
                  {"ปลายทาง"}
                </label>
                <Input
                  value={form.destination}
                  onChange={handleChange("destination")}
                  placeholder="เชียงใหม่"
                  className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                  <Calendar className="h-3 w-3" />
                  {"จำนวนวัน"}
                </label>
                <Input
                  type="number"
                  min={1}
                  value={form.days}
                  onChange={handleChange("days")}
                  className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                  <Users className="h-3 w-3" />
                  {"จำนวนคน"}
                </label>
                <Input
                  type="number"
                  min={1}
                  value={form.people}
                  onChange={handleChange("people")}
                  className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                  <Gauge className="h-3 w-3" />
                  {"กิโลเมตรต่อลิตร (รถ)"}
                </label>
                <Input
                  type="number"
                  min={5}
                  value={form.kmPerLiter}
                  onChange={handleChange("kmPerLiter")}
                  className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/50">
                  <Fuel className="h-3 w-3" />
                  {"ราคาน้ำมัน (บาท/ลิตร)"}
                </label>
                <Input
                  type="number"
                  min={10}
                  value={form.fuelPrice}
                  onChange={handleChange("fuelPrice")}
                  className="border-white/10 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:ring-accent"
                />
              </div>
            </div>

            {error && (
              <div className="mt-1 flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-2 text-[11px] text-red-100">
                <CircleAlert className="h-3.5 w-3.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="mt-1 w-full gap-2 bg-accent font-semibold text-accent-foreground shadow-lg shadow-[hsl(24,90%,55%)]/20 hover:bg-accent/90"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
              {isLoading ? "กำลังคำนวณ..." : "คำนวณทันที"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result section below the planner card */}
      <div aria-live="polite" className="min-h-[140px]">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/10" />
          </div>
        )}
        {!isLoading && result && <TripResult result={result} />}
      </div>
    </div>
  )
}

