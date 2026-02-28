"use client"

import { Car, Coins, Fuel, PartyPopper, Utensils, BedDouble, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TripCalculationResult } from "@/lib/calculateTrip"

type TripResultProps = {
  result: TripCalculationResult
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function TripResult({ result }: TripResultProps) {
  const {
    distance_km,
    duration_hours,
    fuel_cost,
    toll_cost,
    food_cost,
    accommodation_cost,
    total_cost,
    cost_per_person,
    budget_tier,
    food_per_person_per_day,
    accommodation_per_night,
    ordered_stops,
    route_plan,
    segments,
  } = result

  const tierLabel: Record<string, string> = {
    budget: "🟢 ประหยัด",
    mid: "🟡 ปานกลาง",
    comfort: "🔴 สบาย",
  }

  const breakdown = [
    {
      key: "fuel",
      label: "ค่าน้ำมัน",
      value: fuel_cost,
      icon: Fuel,
      color: "bg-amber-400",
    },
    {
      key: "toll",
      label: "ค่าทางด่วน",
      value: toll_cost,
      icon: Coins,
      color: "bg-sky-400",
    },
    {
      key: "food",
      label: "ค่าอาหารโดยประมาณ",
      value: food_cost,
      icon: Utensils,
      color: "bg-emerald-400",
    },
    {
      key: "accommodation",
      label: "ค่าที่พักโดยประมาณ",
      value: accommodation_cost,
      icon: BedDouble,
      color: "bg-violet-400",
    },
  ]

  const visibleBreakdown = breakdown.filter((item) => item.value > 0)
  const safeTotal = total_cost || breakdown.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="border-white/10 bg-slate-950/80 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">สรุปงบประมาณทั้งทริป
            {budget_tier && (
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                {tierLabel[budget_tier] ?? budget_tier}
              </span>
            )}
          </p>
          <CardTitle className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white md:text-3xl">
            <PartyPopper className="h-6 w-6 text-[hsl(24,90%,65%)]" />
            {formatCurrency(total_cost)}
          </CardTitle>
          {cost_per_person > 0 && (
            <p className="mt-1 text-sm font-semibold text-orange-300">
              ≈ {formatCurrency(cost_per_person)} / คน
            </p>
          )}
          <p className="mt-0.5 text-xs text-white/55">ประมาณการเบื้องต้น สามารถเปลี่ยนแปลงได้ตามการใช้จริง</p>
        </div>
        <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs md:block">
          <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-white/70">
            <Car className="h-3 w-3" />
            <span>ระยะทางรวม</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-white">
            {distance_km.toLocaleString("th-TH", { maximumFractionDigits: 0 })} กม.
          </p>
          <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-white/55">
            <Timer className="h-3 w-3" />
            <span>เวลาขับประมาณ {duration_hours.toFixed(1)} ชม.</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Distance + time for mobile */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/80 md:hidden">
          <div className="flex items-center gap-2">
            <Car className="h-3.5 w-3.5" />
            <span>ระยะทาง</span>
          </div>
          <span className="font-medium">
            {distance_km.toLocaleString("th-TH", { maximumFractionDigits: 0 })} กม. /{" "}
            {duration_hours.toFixed(1)} ชม.
          </span>
        </div>

        {/* Breakdown list */}
        <div className="space-y-4">
          {visibleBreakdown.map((item) => {
            const Icon = item.icon
            const percentage = safeTotal > 0 ? (item.value / safeTotal) * 100 : 0

            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/8">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(item.value)}</p>
                    {item.key === "food" && food_per_person_per_day > 0 && (
                      <p className="text-[11px] text-white/45">{formatCurrency(food_per_person_per_day)}/คน/วัน</p>
                    )}
                    {item.key === "accommodation" && accommodation_per_night > 0 && (
                      <p className="text-[11px] text-white/45">{formatCurrency(accommodation_per_night)}/คืน</p>
                    )}
                    {item.key !== "food" && item.key !== "accommodation" && (
                      <p className="text-[11px] text-white/55">{percentage.toFixed(0)}% ของงบรวม</p>
                    )}
                  </div>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Multi-stop route details */}
        {route_plan.length > 2 && (
          <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">เส้นทางที่จัดแล้ว</p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/85">
              {route_plan.map((point, index) => (
                <div key={`${point}-${index}`} className="flex items-center gap-1.5">
                  <span className="rounded-md bg-white/10 px-2 py-1">{point}</span>
                  {index < route_plan.length - 1 && <span className="text-white/50">→</span>}
                </div>
              ))}
            </div>

            {ordered_stops.length > 0 && (
              <p className="text-[11px] text-white/60">
                จุดแวะทั้งหมด {ordered_stops.length} จุด และจัดลำดับให้อัตโนมัติแล้ว
              </p>
            )}

            <div className="space-y-2">
              {segments.map((segment, index) => (
                <div key={`${segment.from}-${segment.to}-${index}`} className="flex items-center justify-between text-[11px] text-white/70">
                  <span>{segment.from} → {segment.to}</span>
                  <span>
                    {segment.distance_km.toLocaleString("th-TH")} กม. · {segment.duration_hours.toFixed(1)} ชม.
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary footer */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-3 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-3.5 w-3.5 text-[hsl(24,90%,65%)]" />
            <span>รวมทุกค่าใช้จ่ายหลักของทริป (ไม่รวมช้อปปิ้งและค่าใช้จ่ายส่วนตัว)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

