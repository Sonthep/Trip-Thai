"use client"

import { useState, useCallback } from "react"
import { OptimizationPanel } from "@/components/optimization-panel"
import { ResultsPanel } from "@/components/results-panel"

type ResultData = {
  totalCost: number
  travelTime: string
  transport: number
  accommodation: number
  food: number
  misc: number
}

// Transport multipliers for cost simulation
const TRANSPORT_COSTS: Record<string, { perKm: number; base: number; speedKmH: number }> = {
  car: { perKm: 3.5, base: 300, speedKmH: 80 },
  flight: { perKm: 2.0, base: 1500, speedKmH: 600 },
  train: { perKm: 1.2, base: 100, speedKmH: 50 },
  bus: { perKm: 0.8, base: 50, speedKmH: 60 },
}

// Priority adjustments
const PRIORITY_MULTIPLIERS: Record<string, { cost: number; time: number }> = {
  cheapest: { cost: 0.85, time: 1.2 },
  fastest: { cost: 1.3, time: 0.7 },
  balanced: { cost: 1.0, time: 1.0 },
  eco: { cost: 0.9, time: 1.1 },
}

// Rough distance map between Thai cities (km)
const DISTANCE_MAP: Record<string, number> = {
  "bangkok-chiang mai": 700,
  "bangkok-phuket": 860,
  "bangkok-pattaya": 150,
  "bangkok-krabi": 780,
  "bangkok-kanchanaburi": 130,
  "bangkok-hua hin": 200,
  "bangkok-khon kaen": 450,
  "bangkok-chiang rai": 830,
  "bangkok-surat thani": 640,
  "chiang mai-chiang rai": 190,
  "chiang mai-khon kaen": 600,
  "phuket-krabi": 165,
  "phuket-surat thani": 290,
}

function getDistance(origin: string, destination: string): number {
  const key1 = `${origin.toLowerCase()}-${destination.toLowerCase()}`
  const key2 = `${destination.toLowerCase()}-${origin.toLowerCase()}`
  return DISTANCE_MAP[key1] || DISTANCE_MAP[key2] || 400
}

function formatHours(h: number): string {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

export function DashboardMain() {
  const [origin, setOrigin] = useState("Bangkok")
  const [destination, setDestination] = useState("Chiang Mai")
  const [days, setDays] = useState(3)
  const [travelers, setTravelers] = useState(2)
  const [transportMode, setTransportMode] = useState("car")
  const [budget, setBudget] = useState([15000])
  const [priority, setPriority] = useState("balanced")
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = useCallback(() => {
    setLoading(true)

    // Simulate async calculation
    setTimeout(() => {
      const dist = getDistance(origin, destination)
      const transportConfig = TRANSPORT_COSTS[transportMode]
      const priorityMult = PRIORITY_MULTIPLIERS[priority]

      // Transport cost
      const rawTransport = (dist * transportConfig.perKm + transportConfig.base) * priorityMult.cost
      const transport = Math.round(rawTransport * travelers)

      // Travel time
      const rawHours = (dist / transportConfig.speedKmH) * priorityMult.time
      const travelTime = formatHours(rawHours)

      // Accommodation
      const nightsCount = Math.max(days - 1, 0)
      const accommodation = Math.round(nightsCount * 800 * priorityMult.cost * Math.ceil(travelers / 2))

      // Food
      const food = Math.round(days * travelers * 350 * priorityMult.cost)

      // Misc (activities, etc.)
      const misc = Math.round(days * travelers * 150 * priorityMult.cost)

      const totalCost = transport + accommodation + food + misc

      setResultData({
        totalCost,
        travelTime,
        transport,
        accommodation,
        food,
        misc,
      })
      setLoading(false)
    }, 800)
  }, [origin, destination, days, travelers, transportMode, priority])

  return (
    <section className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div>
            <OptimizationPanel
              origin={origin}
              destination={destination}
              days={days}
              travelers={travelers}
              transportMode={transportMode}
              budget={budget}
              priority={priority}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onDaysChange={setDays}
              onTravelersChange={setTravelers}
              onTransportModeChange={setTransportMode}
              onBudgetChange={setBudget}
              onPriorityChange={setPriority}
              onCalculate={handleCalculate}
            />
          </div>
          <div>
            <ResultsPanel
              data={resultData}
              loading={loading}
              onRecalculate={handleCalculate}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
