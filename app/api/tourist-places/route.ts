import { NextResponse } from "next/server"
import { getAllTouristPlaces, searchTouristPlaces } from "@/lib/touristPlaces"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const province = searchParams.get("province") ?? undefined
    const q = searchParams.get("q") ?? undefined
    const categoryParam = searchParams.get("category") ?? undefined
    const limitParam = searchParams.get("limit")

    const limit = limitParam ? Number(limitParam) : undefined
    const category = categoryParam as
      | "nature"
      | "temple"
      | "culture"
      | "food"
      | "beach"
      | "viewpoint"
      | undefined

    const useFilter = Boolean(province || q || category || limit)
    const places = useFilter
      ? searchTouristPlaces({ province, q, category, limit })
      : getAllTouristPlaces()

    return NextResponse.json({
      total: places.length,
      places,
    })
  } catch (error) {
    console.error("Tourist places API error:", error)
    return NextResponse.json({ message: "Failed to fetch tourist places" }, { status: 500 })
  }
}
