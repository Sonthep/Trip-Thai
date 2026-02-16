import { NextResponse } from "next/server"
import { calculateTrip, type TripCalculationInput } from "@/lib/calculateTrip"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const input: TripCalculationInput = {
      origin: typeof body.origin === "string" ? body.origin : "",
      destination: typeof body.destination === "string" ? body.destination : "",
      days: Number(body.days) || 1,
      people: Number(body.people) || 1,
      kmPerLiter: Number(body.kmPerLiter) || 12,
      fuelPrice: Number(body.fuelPrice) || 38,
    }

    const result = calculateTrip(input)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Trip calculation error:", error)
    return NextResponse.json({ message: "Failed to calculate trip" }, { status: 400 })
  }
}

