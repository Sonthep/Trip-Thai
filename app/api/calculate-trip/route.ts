import { NextResponse } from "next/server"
import { calculateTrip, type TripCalculationInput } from "@/lib/calculateTrip"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const input: TripCalculationInput = {
      origin: typeof body.origin === "string" ? body.origin : "",
      destination: typeof body.destination === "string" ? body.destination : "",
      stops: Array.isArray(body.stops)
        ? body.stops.filter((stop: unknown): stop is string => typeof stop === "string")
        : [],
      autoOptimizeStops: body.autoOptimizeStops !== false,
      days: Number(body.days) || 1,
      people: Number(body.people) || 1,
      kmPerLiter: Number(body.kmPerLiter) || 12,
      fuelPrice: Number(body.fuelPrice) || 38,
      budgetTier:
        body.budgetTier === "budget" || body.budgetTier === "comfort"
          ? (body.budgetTier as "budget" | "comfort")
          : "mid",
    }

    const result = calculateTrip(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Trip calculation error:", error)
    return NextResponse.json({ message: "Failed to calculate trip" }, { status: 400 })
  }
}

