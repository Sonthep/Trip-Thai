"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type TouristPlace = {
  id: string
  province: string
  name: string
  category: "nature" | "temple" | "culture" | "food" | "beach" | "viewpoint"
  description: string
  location: {
    lat: number
    lng: number
  }
}

type ProvinceSummary = {
  province: string
  lat: number
  lng: number
  placeCount: number
}

const THAILAND_CENTER: LatLngExpression = [13.4, 101.0]

export function ThailandMapExplorer() {
  const [places, setPlaces] = useState<TouristPlace[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true

    async function loadPlaces() {
      setIsLoading(true)
      setError("")

      try {
        const response = await fetch("/api/tourist-places?limit=500")
        if (!response.ok) {
          throw new Error("โหลดข้อมูลสถานที่ไม่สำเร็จ")
        }

        const data = (await response.json()) as { places?: TouristPlace[] }
        if (!mounted) return

        const nextPlaces = data.places ?? []
        setPlaces(nextPlaces)
        if (nextPlaces.length > 0) {
          setSelectedProvince((prev) => prev || nextPlaces[0].province)
        }
      } catch (loadError) {
        if (!mounted) return
        setError(loadError instanceof Error ? loadError.message : "เกิดข้อผิดพลาด")
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadPlaces()

    return () => {
      mounted = false
    }
  }, [])

  const provinceSummary = useMemo<ProvinceSummary[]>(() => {
    const grouped = new Map<string, ProvinceSummary>()

    for (const place of places) {
      const existing = grouped.get(place.province)

      if (existing) {
        existing.placeCount += 1
      } else {
        grouped.set(place.province, {
          province: place.province,
          lat: place.location.lat,
          lng: place.location.lng,
          placeCount: 1,
        })
      }
    }

    return [...grouped.values()].sort((a, b) => a.province.localeCompare(b.province, "th"))
  }, [places])

  const filteredProvinces = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return provinceSummary

    return provinceSummary.filter((province) => province.province.toLowerCase().includes(keyword))
  }, [provinceSummary, query])

  const selectedPlaces = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return places
      .filter((place) => (selectedProvince ? place.province === selectedProvince : true))
      .filter((place) =>
        keyword
          ? `${place.province} ${place.name} ${place.description}`.toLowerCase().includes(keyword)
          : true,
      )
      .slice(0, 12)
  }, [places, selectedProvince, query])

  return (
    <section className="bg-slate-950 py-8 text-white md:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-[1fr_380px] md:px-6">
        <Card className="overflow-hidden border-white/10 bg-slate-900/70">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-xl text-white">แผนที่ประเทศไทย (77 จังหวัด)</CardTitle>
            <p className="text-sm text-white/70">เลือกจังหวัดบนแผนที่เพื่อดูสถานที่ท่องเที่ยวที่แนะนำ</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[72vh] min-h-[520px]">
              <MapContainer
                center={THAILAND_CENTER}
                zoom={6}
                minZoom={5}
                maxZoom={10}
                scrollWheelZoom
                className="h-full w-full"
                style={{ backgroundColor: "#cbd5e1" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                />

                {filteredProvinces.map((province) => {
                  const isSelected = province.province === selectedProvince

                  return (
                    <CircleMarker
                      key={province.province}
                      center={[province.lat, province.lng]}
                      radius={isSelected ? 9 : 7}
                      pathOptions={{
                        color: "#ffffff",
                        weight: 1.5,
                        fillColor: isSelected ? "#ea580c" : "#fb923c",
                        fillOpacity: isSelected ? 0.95 : 0.8,
                      }}
                      eventHandlers={{
                        click: () => setSelectedProvince(province.province),
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                        <div className="text-xs">
                          <strong>{province.province}</strong>
                          <div>{province.placeCount} สถานที่</div>
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  )
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/70">
          <CardHeader className="space-y-3 border-b border-white/10 pb-4">
            <CardTitle className="text-lg text-white">สำรวจสถานที่ท่องเที่ยว</CardTitle>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาจังหวัดหรือสถานที่..."
              className="border-white/15 bg-slate-800 text-white placeholder:text-white/40"
            />
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <Badge variant="secondary" className="bg-white/10 text-white">
                จังหวัด: {provinceSummary.length}
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">
                สถานที่: {places.length}
              </Badge>
              {selectedProvince && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-200">
                  เลือก: {selectedProvince}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            {isLoading && <p className="text-sm text-white/70">กำลังโหลดข้อมูลสถานที่...</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}

            {!isLoading && !error && (
              <>
                <div className="max-h-44 overflow-y-auto rounded-lg border border-white/10">
                  {filteredProvinces.map((province) => (
                    <button
                      key={province.province}
                      type="button"
                      onClick={() => setSelectedProvince(province.province)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                        province.province === selectedProvince
                          ? "bg-orange-500/25 text-orange-100"
                          : "border-b border-white/5 text-white/80 hover:bg-white/5"
                      }`}
                    >
                      <span>{province.province}</span>
                      <span className="text-xs text-white/60">{province.placeCount}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">สถานที่แนะนำ</p>
                  <div className="max-h-[36vh] space-y-2 overflow-y-auto pr-1">
                    {selectedPlaces.map((place) => (
                      <div key={place.id} className="rounded-lg border border-white/10 bg-slate-800/70 p-3">
                        <p className="text-sm font-semibold text-white">{place.name}</p>
                        <p className="mt-1 text-xs text-white/60">{place.province} · {place.category}</p>
                        <p className="mt-1 text-xs text-white/70">{place.description}</p>
                      </div>
                    ))}

                    {selectedPlaces.length === 0 && (
                      <p className="text-sm text-white/60">ไม่พบข้อมูลตามคำค้น</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
