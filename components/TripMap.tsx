"use client"

import { memo, useMemo } from "react"
import L from "leaflet"
import { MapContainer, CircleMarker, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet"
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

function makeWaypointIcon(num: number) {
  return L.divIcon({
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:#f97316;border:2px solid #fff;
      display:flex;align-items:center;justify-content:center;
      font-size:10px;font-weight:900;color:#fff;
      box-shadow:0 2px 6px rgba(0,0,0,.5);">${num}</div>`,
  })
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

        {/* Route polyline through all points */}
        <Polyline
          positions={path}
          pathOptions={{ color: "#38bdf8", weight: 3, opacity: 0.85, dashArray: "6 6" }}
        />

        {/* Origin */}
        <CircleMarker
          center={[origin.position.lat, origin.position.lng]}
          radius={7}
          pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 1 }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]} className="!border-0 !bg-black/70 !text-white !text-[10px] !rounded-lg !px-2 !py-0.5 !shadow-none">
            {origin.label}
          </Tooltip>
        </CircleMarker>

        {/* Waypoints (tourist places from plan basket) */}
        {waypoints.sort((a, b) => a.index - b.index).map((wp) => (
          <Marker
            key={wp.index}
            position={[wp.position.lat, wp.position.lng]}
            icon={makeWaypointIcon(wp.index)}
          >
            <Tooltip direction="top" offset={[0, -12]} className="!border-0 !bg-black/70 !text-white !text-[10px] !rounded-lg !px-2 !py-0.5 !shadow-none">
              {wp.label}
            </Tooltip>
          </Marker>
        ))}

        {/* Destination */}
        <CircleMarker
          center={[destination.position.lat, destination.position.lng]}
          radius={8}
          pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 1 }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]} className="!border-0 !bg-black/70 !text-white !text-[10px] !rounded-lg !px-2 !py-0.5 !shadow-none">
            {destination.label}
          </Tooltip>
        </CircleMarker>
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

