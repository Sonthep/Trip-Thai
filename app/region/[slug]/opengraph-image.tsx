import { ImageResponse } from "next/og"
import { getRegionBySlug } from "@/lib/regions"

export const runtime = "edge"
export const contentType = "image/png"
export const size = {
  width: 1200,
  height: 630,
}

const REGION_ACCENT: Record<string, string> = {
  north:     "#f59e0b", // amber
  south:     "#0ea5e9", // sky
  central:   "#10b981", // emerald
  northeast: "#f97316", // orange
}

const REGION_EMOJI: Record<string, string> = {
  north:     "🏔️",
  south:     "🏖️",
  central:   "🏛️",
  northeast: "🌾",
}

type OGProps = {
  params: Promise<{ slug: string }>
}

export default async function OpenGraphImage({ params }: OGProps) {
  const { slug } = await params
  const region = getRegionBySlug(slug)

  if (!region) {
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

  const photoUrl = `${region.heroImg.split("?")[0]}?w=1200&q=80`
  const accent = REGION_ACCENT[slug] ?? "#f97316"
  const emoji = REGION_EMOJI[slug] ?? "🗺️"

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
              "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.72) 55%, rgba(2,6,23,0.25) 100%)",
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
          {/* Header — region badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                background: `rgba(${hexToRgb(accent)},0.20)`,
                border: `1px solid rgba(${hexToRgb(accent)},0.50)`,
                borderRadius: 99,
                padding: "8px 18px",
                fontSize: 22,
                fontWeight: 600,
                color: accent,
                display: "flex",
              }}
            >
              {emoji} {region.nameEn}
            </div>
          </div>

          {/* Title block */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontSize: 70,
                fontWeight: 800,
                lineHeight: 1.05,
                maxWidth: 680,
              }}
            >
              {region.name}
            </div>
            <div
              style={{
                fontSize: 30,
                color: "#94a3b8",
                maxWidth: 640,
                lineHeight: 1.4,
              }}
            >
              {region.tagline}
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
            <div style={{ display: "flex", gap: 16 }}>
              {/* Route count pill */}
              <div
                style={{
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  borderRadius: 12,
                  padding: "10px 20px",
                  fontSize: 24,
                  color: "#fcd34d",
                  display: "flex",
                }}
              >
                🛣️ {region.routeCount} เส้นทาง
              </div>
              {/* Budget pill */}
              <div
                style={{
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.4)",
                  borderRadius: 12,
                  padding: "10px 20px",
                  fontSize: 24,
                  color: "#6ee7b7",
                  display: "flex",
                }}
              >
                💰 {region.budgetRange}
              </div>
            </div>
            <div
              style={{
                fontSize: 26,
                color: "#64748b",
                fontWeight: 600,
                display: "flex",
              }}
            >
              tripthai.app
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}

/** Convert 6-digit hex color to "r,g,b" string for rgba() */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r},${g},${b}`
}
