"use client"

import { memo, useEffect, useMemo, useState } from "react"
import L from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import { MapPin, Fuel, Clock, Route } from "lucide-react"

type LatLng = {
  lat: number
  lng: number
}

export type TripMapWaypoint = {
  position: LatLng
  label: string
  /** 1-based display number */
  index: number
  category?: string
}

export type TripMapProps = {
  origin: {
    position: LatLng
    label: string
  }
  destination: {
    position: LatLng
    label: string
  }
  distanceKm: number
  durationHours: number
  fuelCost: number
  /** Optional tourist-place waypoints from the plan basket */
  waypoints?: TripMapWaypoint[]
}

function FitBounds({ positions }: { positions: LatLng[] }) {
  const map = useMap()
  useMemo(() => {
    if (positions.length < 2) return
    const bounds = positions.map((p) => [p.lat, p.lng] as LatLngExpression)
    map.fitBounds(bounds as [LatLngExpression, LatLngExpression], { padding: [60, 40], maxZoom: 9 })
  }, [map, positions])
  return null
}

// ── OSRM real-road routing ─────────────────────────────────────────────
function OsrmRoute({ positions, fallbackPath }: { positions: LatLng[]; fallbackPath: LatLngExpression[] }) {
  const [routePath, setRoutePath] = useState<LatLngExpression[] | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (positions.length < 2) return
    const coords = positions.map((p) => `${p.lng},${p.lat}`).join(";")
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    )
      .then((r) => r.json())
      .then((data) => {
        const geo = data?.routes?.[0]?.geometry?.coordinates
        if (geo) {
          setRoutePath(geo.map(([lng, lat]: [number, number]) => [lat, lng] as LatLngExpression))
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions.map((p) => `${p.lat},${p.lng}`).join("|")])

  if (routePath) {
    return (
      <Polyline
        positions={routePath}
        pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.9 }}
      />
    )
  }
  // Fallback: straight dashed line while loading
  return (
    <Polyline
      positions={fallbackPath}
      pathOptions={{ color: "#38bdf8", weight: 3, opacity: fetching ? 0.4 : 0.75, dashArray: "6 6" }}
    />
  )
}

function makeWaypointIcon(num: number) {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:#f97316;border:2.5px solid #fff;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:900;color:#fff;
      box-shadow:0 2px 8px rgba(0,0,0,.6);cursor:pointer;">${num}</div>`,
  })
}

function makeEndpointIcon(color: string) {
  return L.divIcon({
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="
      width:20px;height:20px;border-radius:50%;
      background:${color};border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.6);cursor:pointer;"></div>`,
  })
}

function gmLink(lat: number, lng: number, label: string) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query=${encodeURIComponent(label)}`
}

function TripMapInner({ origin, destination, distanceKm, durationHours, fuelCost, waypoints = [] }: TripMapProps) {
  const allPositions: LatLng[] = useMemo(() => {
    const wps = [...waypoints].sort((a, b) => a.index - b.index).map((w) => w.position)
    return [origin.position, ...wps, destination.position]
  }, [origin.position, destination.position, waypoints])

  const path: LatLngExpression[] = useMemo(
    () => allPositions.map((p) => [p.lat, p.lng]),
    [allPositions],
  )

  const center: LatLngExpression = useMemo(
    () => [
      (origin.position.lat + destination.position.lat) / 2,
      (origin.position.lng + destination.position.lng) / 2,
    ],
    [origin.position, destination.position],
  )

  return (
    <div className="relative h-60 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 shadow-lg shadow-black/40">
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ backgroundColor: "#020617" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FitBounds positions={allPositions} />

        {/* OSRM real-road route */}
        <OsrmRoute positions={allPositions} fallbackPath={path} />

        {/* Origin */}
        <Marker
          position={[origin.position.lat, origin.position.lng]}
          icon={makeEndpointIcon("#38bdf8")}
        >
          <Tooltip permanent direction="top" offset={[0, -12]} className="!border-0 !bg-black/70 !text-white !text-[10px] !rounded-lg !px-2 !py-0.5 !shadow-none">
            {origin.label}
          </Tooltip>
          <Popup className="trip-popup">
            <div style={{ minWidth: 160, fontFamily: "sans-serif" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#0f172a" }}>📍 {origin.label}</p>
              <p style={{ margin: "0 0 8px", fontSize: 10, color: "#64748b" }}>{origin.position.lat.toFixed(5)}, {origin.position.lng.toFixed(5)}</p>
              <a
                href={gmLink(origin.position.lat, origin.position.lng, origin.label)}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#4285f4", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, textDecoration: "none" }}
              >
                🗺 เปิดใน Google Maps
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Waypoints (tourist places from plan basket) */}
        {waypoints.sort((a, b) => a.index - b.index).map((wp) => (
          <Marker
            key={wp.index}
            position={[wp.position.lat, wp.position.lng]}
            icon={makeWaypointIcon(wp.index)}
          >
            <Tooltip direction="top" offset={[0, -14]} className="!border-0 !bg-black/70 !text-white !text-[10px] !rounded-lg !px-2 !py-0.5 !shadow-none">
              {wp.label}
            </Tooltip>
            <Popup className="trip-popup">
              <div style={{ minWidth: 160, fontFamily: "sans-serif" }}>
                <p style={{ margin: "0 0 2px", fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>จุดแวะที่ {wp.index}</p>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#0f172a" }}>📍 {wp.label}</p>
                <p style={{ margin: "0 0 8px", fontSize: 10, color: "#64748b" }}>{wp.position.lat.toFixed(5)}, {wp.position.lng.toFixed(5)}</p>
                <a
                  href={gmLink(wp.position.lat, wp.position.lng, wp.label)}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#4285f4", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, textDecoration: "none" }}
                >
                  🗺 เปิดใน Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination */}
        <Marker
          position={[destination.position.lat, destination.position.lng]}
          icon={makeEndpointIcon("#22c55e")}
        >
          <Tooltip permanent direction="top" offset={[0, -12]} className="!border-0 !bg-black/70 !text-white !text-[10px] !rounded-lg !px-2 !py-0.5 !shadow-none">
            {destination.label}
          </Tooltip>
          <Popup className="trip-popup">
            <div style={{ minWidth: 160, fontFamily: "sans-serif" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#0f172a" }}>🏁 {destination.label}</p>
              <p style={{ margin: "0 0 8px", fontSize: 10, color: "#64748b" }}>{destination.position.lat.toFixed(5)}, {destination.position.lng.toFixed(5)}</p>
              <a
                href={gmLink(destination.position.lat, destination.position.lng, destination.label)}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#4285f4", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, textDecoration: "none" }}
              >
                🗺 เปิดใน Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating metric badges */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2 text-[11px]">
        <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-white/90 shadow-md shadow-black/40 backdrop-blur">
          <Route className="h-3.5 w-3.5 text-sky-400" />
          <span>{distanceKm.toLocaleString("th-TH", { maximumFractionDigits: 0 })} กม.</span>
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-white/90 shadow-md shadow-black/40 backdrop-blur">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>{durationHours.toFixed(1)} ชม. โดยประมาณ</span>
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-white/90 shadow-md shadow-black/40 backdrop-blur">
          <Fuel className="h-3.5 w-3.5 text-amber-400" />
          <span>ค่าน้ำมัน ~ {fuelCost.toLocaleString("th-TH", { maximumFractionDigits: 0 })} บาท</span>
        </div>
      </div>

      {/* Origin / destination labels bottom-left */}
      <div className="pointer-events-none absolute left-4 bottom-4 flex flex-col gap-1 rounded-xl bg-black/55 px-3 py-2 text-[11px] text-white/85 backdrop-blur">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-sky-400" />
          จุดเริ่มต้น: {origin.label}
        </span>
        {waypoints.length > 0 && (
          <span className="flex items-center gap-1.5 text-orange-300">
            <MapPin className="h-3.5 w-3.5 text-orange-400" />
            แวะ {waypoints.length} สถานที่
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          ปลายทาง: {destination.label}
        </span>
      </div>
    </div>
  )
}

export const TripMap = memo(TripMapInner)

