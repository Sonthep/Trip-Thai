"use client"

import { memo, useMemo } from "react"
import { MapContainer, CircleMarker, Polyline, TileLayer, useMap } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import { MapPin, Fuel, Clock, Route } from "lucide-react"

type LatLng = {
  lat: number
  lng: number
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
}

function FitBounds({ origin, destination }: { origin: LatLng; destination: LatLng }) {
  const map = useMap()

  useMemo(() => {
    const bounds: [LatLngExpression, LatLngExpression] = [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ]
    map.fitBounds(bounds, { padding: [60, 40], maxZoom: 7 })
  }, [map, origin, destination])

  return null
}

function TripMapInner({ origin, destination, distanceKm, durationHours, fuelCost }: TripMapProps) {
  const path: LatLngExpression[] = useMemo(
    () => [
      [origin.position.lat, origin.position.lng],
      [destination.position.lat, destination.position.lng],
    ],
    [origin.position, destination.position],
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

        <FitBounds origin={origin.position} destination={destination.position} />

        <Polyline
          positions={path}
          pathOptions={{
            color: "#38bdf8",
            weight: 4,
            opacity: 0.9,
            dashArray: "6 6",
          }}
        />

        <CircleMarker
          center={path[0]}
          radius={6}
          pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 1 }}
        />
        <CircleMarker
          center={path[1]}
          radius={7}
          pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 1 }}
        />
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
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          ปลายทาง: {destination.label}
        </span>
      </div>
    </div>
  )
}

export const TripMap = memo(TripMapInner)

