"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  Plane,
  TrainFront,
  Bus,
  SlidersHorizontal,
  MapPin,
  Users,
  CalendarDays,
} from "lucide-react"

const THAI_CITIES = [
  "Bangkok",
  "Chiang Mai",
  "Phuket",
  "Pattaya",
  "Krabi",
  "Kanchanaburi",
  "Hua Hin",
  "Khon Kaen",
  "Chiang Rai",
  "Surat Thani",
]

type OptimizationPanelProps = {
  origin: string
  destination: string
  days: number
  travelers: number
  transportMode: string
  budget: number[]
  priority: string
  onOriginChange: (v: string) => void
  onDestinationChange: (v: string) => void
  onDaysChange: (v: number) => void
  onTravelersChange: (v: number) => void
  onTransportModeChange: (v: string) => void
  onBudgetChange: (v: number[]) => void
  onPriorityChange: (v: string) => void
  onCalculate: () => void
}

export function OptimizationPanel({
  origin,
  destination,
  days,
  travelers,
  transportMode,
  budget,
  priority,
  onOriginChange,
  onDestinationChange,
  onDaysChange,
  onTravelersChange,
  onTransportModeChange,
  onBudgetChange,
  onPriorityChange,
  onCalculate,
}: OptimizationPanelProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Optimization Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Origin */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="origin" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Origin
          </Label>
          <Input
            id="origin"
            placeholder="e.g. Bangkok"
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            list="origin-list"
            className="h-9 text-sm"
          />
          <datalist id="origin-list">
            {THAI_CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="destination" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Destination
          </Label>
          <Input
            id="destination"
            placeholder="e.g. Chiang Mai"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            list="destination-list"
            className="h-9 text-sm"
          />
          <datalist id="destination-list">
            {THAI_CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Duration & Travelers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="days" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              Trip Duration
            </Label>
            <Input
              id="days"
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => onDaysChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="travelers" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Users className="h-3 w-3" />
              Travelers
            </Label>
            <Input
              id="travelers"
              type="number"
              min={1}
              max={20}
              value={travelers}
              onChange={(e) => onTravelersChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Transport Mode */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Transport Mode</Label>
          <Tabs value={transportMode} onValueChange={onTransportModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="car" className="gap-1 text-xs">
                <Car className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Car</span>
              </TabsTrigger>
              <TabsTrigger value="flight" className="gap-1 text-xs">
                <Plane className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Flight</span>
              </TabsTrigger>
              <TabsTrigger value="train" className="gap-1 text-xs">
                <TrainFront className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Train</span>
              </TabsTrigger>
              <TabsTrigger value="bus" className="gap-1 text-xs">
                <Bus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Bus</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Budget Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Budget Range</Label>
            <span className="text-xs font-semibold text-foreground">
              {budget[0].toLocaleString()} THB
            </span>
          </div>
          <Slider
            min={3000}
            max={50000}
            step={500}
            value={budget}
            onValueChange={onBudgetChange}
            className="py-1"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3,000</span>
            <span>50,000</span>
          </div>
        </div>

        {/* Priority Toggle */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Optimization Priority</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { value: "cheapest", label: "Cheapest" },
              { value: "fastest", label: "Fastest" },
              { value: "balanced", label: "Balanced" },
              { value: "eco", label: "Eco-Friendly" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onPriorityChange(opt.value)}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  priority === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button onClick={onCalculate} className="mt-1 w-full gap-2">
          Start Optimization
        </Button>
      </CardContent>
    </Card>
  )
}
