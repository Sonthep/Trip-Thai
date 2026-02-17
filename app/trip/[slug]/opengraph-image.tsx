import { ImageResponse } from "next/og"
import { getTripBySlug } from "@/lib/trips"

export const runtime = "edge"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

type OpenGraphImageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params
  const trip = getTripBySlug(slug)

  if (!trip) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#020617",
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          TripThai
        </div>
      ),
      size,
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top right, rgba(16,185,129,0.28), transparent 45%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
          color: "#ffffff",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            color: "#86efac",
            fontWeight: 600,
          }}
        >
          TripThai • Road Trip Planner
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1 }}>{trip.name}</div>
          <div style={{ display: "flex", gap: "20px", fontSize: 30, color: "#cbd5e1" }}>
            <div>{trip.durationLabel}</div>
            <div>•</div>
            <div>{`${trip.distanceKm} กม.`}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#e2e8f0",
          }}
        >
          <div>{trip.budgetRangeLabel}</div>
          <div style={{ color: "#86efac", fontWeight: 700 }}>tripthai.app</div>
        </div>
      </div>
    ),
    size,
  )
}
