import { ImageResponse } from "next/og"
import { getTripBySlug } from "@/lib/trips"

export const runtime = "edge"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

const TRIP_PHOTOS: Record<string, string> = {
  "bangkok-chiang-mai":   "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80",
  "bangkok-chiang-rai":   "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80",
  "bangkok-phuket":       "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
  "bangkok-krabi":        "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=80",
  "bangkok-hua-hin":      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  "bangkok-pattaya":      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
  "bangkok-kanchanaburi": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  "bangkok-ayutthaya":    "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&q=80",
  "bangkok-khao-yai":     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  "chiang-mai-pai":       "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80",
  "phuket-krabi":         "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?w=1200&q=80"

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

  const photoUrl = TRIP_PHOTOS[slug] ?? FALLBACK

  // Fetch photo as ArrayBuffer for ImageResponse
  let photoData: ArrayBuffer | null = null
  try {
    const res = await fetch(photoUrl)
    if (res.ok) photoData = await res.arrayBuffer()
  } catch {
    // fall through to gradient-only bg
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        {/* Background photo */}
        {photoData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.70) 60%, rgba(2,6,23,0.30) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px",
            width: "100%",
            color: "#ffffff",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                background: "rgba(249,115,22,0.25)",
                border: "1px solid rgba(249,115,22,0.5)",
                borderRadius: 99,
                padding: "8px 18px",
                fontSize: 22,
                fontWeight: 600,
                color: "#fb923c",
                display: "flex",
              }}
            >
              🚗 Road Trip
            </div>
          </div>

          {/* Title block */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05, maxWidth: 700 }}>
              {trip.name}
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 28, color: "#94a3b8" }}>
              <div>{trip.durationLabel.split(" ").slice(0, 4).join(" ")}</div>
              <div>·</div>
              <div>{trip.distanceKm} กม.</div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.4)",
                borderRadius: 12,
                padding: "10px 20px",
                fontSize: 26,
                color: "#fcd34d",
                display: "flex",
              }}
            >
              💰 {trip.budgetRangeLabel.replace("งบรวม ", "")}
            </div>
            <div style={{ fontSize: 26, color: "#64748b", fontWeight: 600, display: "flex" }}>
              tripthai.app
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
