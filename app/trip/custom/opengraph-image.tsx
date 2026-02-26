import { ImageResponse } from "next/og"

export const runtime = "edge"
export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

type Props = {
  searchParams: Promise<{
    origin?: string
    destination?: string
    people?: string
    kmPerLiter?: string
  }>
}

export default async function Image({ searchParams }: Props) {
  const sp = await searchParams
  const origin = sp.origin ?? "ต้นทาง"
  const destination = sp.destination ?? "ปลายทาง"
  const people = Number(sp.people) || 2
  const kmPerLiter = Number(sp.kmPerLiter) || 12
  const carLabel =
    kmPerLiter >= 17 ? "รถ ECO" : kmPerLiter >= 14 ? "รถเก๋ง" : kmPerLiter >= 11 ? "รถ SUV" : "รถกระบะ"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(249,115,22,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(56,189,248,0.06)",
            display: "flex",
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
          {/* Badge */}
          <div style={{ display: "flex" }}>
            <div
              style={{
                background: "rgba(249,115,22,0.2)",
                border: "1px solid rgba(249,115,22,0.5)",
                borderRadius: 99,
                padding: "8px 20px",
                fontSize: 22,
                fontWeight: 600,
                color: "#fb923c",
                display: "flex",
              }}
            >
              🚗 ประมาณการทริปขับรถ
            </div>
          </div>

          {/* Route */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                fontSize: 72,
                fontWeight: 800,
              }}
            >
              <span>{origin}</span>
              <span style={{ color: "#f97316", fontSize: 60 }}>→</span>
              <span>{destination}</span>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 26, color: "#94a3b8" }}>
              <span>👥 {people} คน</span>
              <span>·</span>
              <span>🚗 {carLabel}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              💰 คำนวณงบทริปได้เลย
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
