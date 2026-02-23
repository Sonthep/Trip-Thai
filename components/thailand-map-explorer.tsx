"use client"

import { useEffect, useMemo, useState } from "react"
import { GeoJSON, MapContainer, useMap } from "react-leaflet"
import type { GeoJsonObject } from "geojson"
import type { Layer, PathOptions, StyleFunction } from "leaflet"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
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

type Region = "all" | "north" | "northeast" | "central" | "south"

type ProvinceSummary = {
  province: string
  placeCount: number
  region: Exclude<Region, "all">
}

type FeatureLike = {
  properties?: { name?: string }
  geometry?: {
    coordinates?: unknown
  }
}

type FeatureCollectionLike = {
  features: FeatureLike[]
}

type InteractiveLayer = Layer & {
  bindTooltip: (content: string, options: Record<string, unknown>) => void
  on: (handlers: {
    mouseover: () => void
    mouseout: () => void
    click: () => void
  }) => void
}

const THAILAND_CENTER: [number, number] = [13.2, 101]

const PROVINCE_REGION_MAP: Record<string, Exclude<Region, "all">> = {
  // ภาคเหนือ
  เชียงใหม่: "north",
  เชียงราย: "north",
  ลำปาง: "north",
  ลำพูน: "north",
  แม่ฮ่องสอน: "north",
  น่าน: "north",
  พะเยา: "north",
  แพร่: "north",
  อุตรดิตถ์: "north",
  ตาก: "north",
  สุโขทัย: "north",
  พิษณุโลก: "north",
  พิจิตร: "north",
  กำแพงเพชร: "north",
  นครสวรรค์: "north",
  อุทัยธานี: "north",
  เพชรบูรณ์: "north",

  // ภาคอีสาน
  กาฬสินธุ์: "northeast",
  ขอนแก่น: "northeast",
  ชัยภูมิ: "northeast",
  นครพนม: "northeast",
  นครราชสีมา: "northeast",
  บึงกาฬ: "northeast",
  บุรีรัมย์: "northeast",
  มหาสารคาม: "northeast",
  มุกดาหาร: "northeast",
  ยโสธร: "northeast",
  ร้อยเอ็ด: "northeast",
  เลย: "northeast",
  ศรีสะเกษ: "northeast",
  สกลนคร: "northeast",
  สุรินทร์: "northeast",
  หนองคาย: "northeast",
  หนองบัวลำภู: "northeast",
  อุดรธานี: "northeast",
  อุบลราชธานี: "northeast",
  อำนาจเจริญ: "northeast",

  // ภาคกลาง (รวมตะวันออก/ตะวันตก)
  กรุงเทพมหานคร: "central",
  กระบี่: "south",
  กาญจนบุรี: "central",
  จันทบุรี: "central",
  ฉะเชิงเทรา: "central",
  ชลบุรี: "central",
  ชัยนาท: "central",
  นครนายก: "central",
  นครปฐม: "central",
  นนทบุรี: "central",
  ปทุมธานี: "central",
  ประจวบคีรีขันธ์: "central",
  ปราจีนบุรี: "central",
  พระนครศรีอยุธยา: "central",
  เพชรบุรี: "central",
  ระยอง: "central",
  ราชบุรี: "central",
  ลพบุรี: "central",
  สมุทรปราการ: "central",
  สมุทรสงคราม: "central",
  สมุทรสาคร: "central",
  สระแก้ว: "central",
  สระบุรี: "central",
  สิงห์บุรี: "central",
  สุพรรณบุรี: "central",
  อ่างทอง: "central",
  ตราด: "central",

  // ภาคใต้
  ชุมพร: "south",
  ตรัง: "south",
  นครศรีธรรมราช: "south",
  นราธิวาส: "south",
  ปัตตานี: "south",
  พังงา: "south",
  พัทลุง: "south",
  ภูเก็ต: "south",
  ระนอง: "south",
  สตูล: "south",
  สงขลา: "south",
  สุราษฎร์ธานี: "south",
  ยะลา: "south",
}

const PROVINCE_ALIASES: Record<string, string> = {
  กรุงเทพ: "กรุงเทพมหานคร",
  กรุงเทพมหานคร: "กรุงเทพมหานคร",
  อยุธยา: "พระนครศรีอยุธยา",
}

const ENGLISH_TO_THAI_PROVINCE: Record<string, string> = {
  "Amnat Charoen": "อำนาจเจริญ",
  "Ang Thong": "อ่างทอง",
  "Bangkok Metropolis": "กรุงเทพมหานคร",
  "Bueng Kan": "บึงกาฬ",
  "Buri Ram": "บุรีรัมย์",
  "Chachoengsao": "ฉะเชิงเทรา",
  "Chai Nat": "ชัยนาท",
  "Chaiyaphum": "ชัยภูมิ",
  "Chanthaburi": "จันทบุรี",
  "Chiang Mai": "เชียงใหม่",
  "Chiang Rai": "เชียงราย",
  "Chon Buri": "ชลบุรี",
  "Chumphon": "ชุมพร",
  "Kalasin": "กาฬสินธุ์",
  "Kamphaeng Phet": "กำแพงเพชร",
  "Kanchanaburi": "กาญจนบุรี",
  "Khon Kaen": "ขอนแก่น",
  "Krabi": "กระบี่",
  "Lampang": "ลำปาง",
  "Lamphun": "ลำพูน",
  "Loei": "เลย",
  "Lop Buri": "ลพบุรี",
  "Mae Hong Son": "แม่ฮ่องสอน",
  "Maha Sarakham": "มหาสารคาม",
  "Mukdahan": "มุกดาหาร",
  "Nakhon Nayok": "นครนายก",
  "Nakhon Pathom": "นครปฐม",
  "Nakhon Phanom": "นครพนม",
  "Nakhon Ratchasima": "นครราชสีมา",
  "Nakhon Sawan": "นครสวรรค์",
  "Nakhon Si Thammarat": "นครศรีธรรมราช",
  "Nan": "น่าน",
  "Narathiwat": "นราธิวาส",
  "Nong Bua Lam Phu": "หนองบัวลำภู",
  "Nong Khai": "หนองคาย",
  "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Pattani": "ปัตตานี",
  "Phangnga": "พังงา",
  "Phatthalung": "พัทลุง",
  "Phayao": "พะเยา",
  "Phetchabun": "เพชรบูรณ์",
  "Phetchaburi": "เพชรบุรี",
  "Phichit": "พิจิตร",
  "Phitsanulok": "พิษณุโลก",
  "Phra Nakhon Si Ayutthaya": "พระนครศรีอยุธยา",
  "Phrae": "แพร่",
  "Phuket": "ภูเก็ต",
  "Prachin Buri": "ปราจีนบุรี",
  "Prachuap Khiri Khan": "ประจวบคีรีขันธ์",
  "Ranong": "ระนอง",
  "Ratchaburi": "ราชบุรี",
  "Rayong": "ระยอง",
  "Roi Et": "ร้อยเอ็ด",
  "Sa Kaeo": "สระแก้ว",
  "Sakon Nakhon": "สกลนคร",
  "Samut Prakan": "สมุทรปราการ",
  "Samut Sakhon": "สมุทรสาคร",
  "Samut Songkhram": "สมุทรสงคราม",
  "Saraburi": "สระบุรี",
  "Satun": "สตูล",
  "Si Sa Ket": "ศรีสะเกษ",
  "Sing Buri": "สิงห์บุรี",
  "Songkhla": "สงขลา",
  "Sukhothai": "สุโขทัย",
  "Suphan Buri": "สุพรรณบุรี",
  "Surat Thani": "สุราษฎร์ธานี",
  "Surin": "สุรินทร์",
  "Tak": "ตาก",
  "Trang": "ตรัง",
  "Trat": "ตราด",
  "Ubon Ratchathani": "อุบลราชธานี",
  "Udon Thani": "อุดรธานี",
  "Uthai Thani": "อุทัยธานี",
  "Uttaradit": "อุตรดิตถ์",
  "Yala": "ยะลา",
  "Yasothon": "ยโสธร",
}

function normalizeProvinceName(province: string) {
  return PROVINCE_ALIASES[province] ?? province
}

function getRegionByProvince(province: string): Exclude<Region, "all"> {
  const normalized = normalizeProvinceName(province)
  return PROVINCE_REGION_MAP[normalized] ?? "central"
}

function regionLabel(region: Region) {
  if (region === "all") return "ทั้งหมด"
  if (region === "north") return "ภาคเหนือ"
  if (region === "northeast") return "ภาคอีสาน"
  if (region === "central") return "ภาคกลาง"
  return "ภาคใต้"
}

function regionColor(region: Exclude<Region, "all">) {
  if (region === "north") return "#f59e0b"
  if (region === "northeast") return "#f97316"
  if (region === "central") return "#fb923c"
  return "#ef4444"
}

function collectCoordinates(value: unknown, acc: [number, number][]) {
  if (!Array.isArray(value)) return

  if (value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    acc.push([value[0], value[1]])
    return
  }

  for (const child of value) {
    collectCoordinates(child, acc)
  }
}

function getFeatureCenter(feature: FeatureLike) {
  const points: [number, number][] = []
  collectCoordinates(feature.geometry?.coordinates, points)

  if (points.length === 0) {
    return { lat: 13.5, lng: 101 }
  }

  const lat = points.reduce((sum, point) => sum + point[1], 0) / points.length
  const lng = points.reduce((sum, point) => sum + point[0], 0) / points.length

  return { lat, lng }
}

function getGeoBounds(data: FeatureCollectionLike) {
  const coordinates: [number, number][] = []

  for (const feature of data.features) {
    collectCoordinates(feature.geometry?.coordinates, coordinates)
  }

  if (coordinates.length === 0) {
    return null
  }

  let minLng = coordinates[0][0]
  let maxLng = coordinates[0][0]
  let minLat = coordinates[0][1]
  let maxLat = coordinates[0][1]

  for (const [lng, lat] of coordinates) {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }

  return {
    southWest: [minLat, minLng] as [number, number],
    northEast: [maxLat, maxLng] as [number, number],
  }
}

function FitThailandBounds({ data }: { data: FeatureCollectionLike | null }) {
  const map = useMap()

  useEffect(() => {
    if (!data) return

    const bounds = getGeoBounds(data)
    if (!bounds) return

    map.fitBounds([bounds.southWest, bounds.northEast], {
      padding: [34, 34],
      maxZoom: 7,
    })
  }, [map, data])

  return null
}

export function ThailandMapExplorer() {
  const [places, setPlaces] = useState<TouristPlace[]>([])
  const [geoData, setGeoData] = useState<FeatureCollectionLike | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [hoveredProvince, setHoveredProvince] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<Region>("all")
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true

    async function loadPlaces() {
      setIsLoading(true)
      setError("")

      try {
        const [placesResponse, geoResponse] = await Promise.all([
          fetch("/api/tourist-places?limit=500"),
          fetch("/data/thailand-provinces.geojson"),
        ])

        if (!placesResponse.ok || !geoResponse.ok) {
          throw new Error("โหลดข้อมูลสถานที่ไม่สำเร็จ")
        }

        const [placesData, geoJson] = await Promise.all([
          placesResponse.json() as Promise<{ places?: TouristPlace[] }>,
          geoResponse.json() as Promise<FeatureCollectionLike>,
        ])

        if (!mounted) return

        const nextPlaces = placesData.places ?? []
        setPlaces(nextPlaces)
        setGeoData(geoJson)

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

  const provinceCenters = useMemo(() => {
    const grouped = new Map<string, { latSum: number; lngSum: number; count: number }>()

    for (const place of places) {
      const current = grouped.get(place.province) ?? { latSum: 0, lngSum: 0, count: 0 }
      current.latSum += place.location.lat
      current.lngSum += place.location.lng
      current.count += 1
      grouped.set(place.province, current)
    }

    const map = new Map<string, { lat: number; lng: number }>()
    for (const [province, value] of grouped.entries()) {
      map.set(province, {
        lat: value.latSum / value.count,
        lng: value.lngSum / value.count,
      })
    }
    return map
  }, [places])

  const provinceSummary = useMemo<ProvinceSummary[]>(() => {
    const grouped = new Map<string, number>()

    for (const place of places) {
      grouped.set(place.province, (grouped.get(place.province) ?? 0) + 1)
    }

    return [...grouped.entries()]
      .map(([province, placeCount]) => ({
        province,
        placeCount,
        region: getRegionByProvince(province),
      }))
      .sort((a, b) => a.province.localeCompare(b.province, "th"))
  }, [places])

  const provinceMetaMap = useMemo(() => {
    const map = new Map<string, ProvinceSummary>()
    for (const province of provinceSummary) {
      map.set(province.province, province)
    }
    return map
  }, [provinceSummary])

  const filteredProvinces = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return provinceSummary.filter((province) => {
      const regionPass = selectedRegion === "all" ? true : province.region === selectedRegion
      const keywordPass = keyword ? province.province.toLowerCase().includes(keyword) : true
      return regionPass && keywordPass
    })
  }, [provinceSummary, query, selectedRegion])

  useEffect(() => {
    if (!selectedProvince || selectedRegion === "all") {
      return
    }

    const selectedMeta = provinceMetaMap.get(selectedProvince)
    if (!selectedMeta || selectedMeta.region !== selectedRegion) {
      setSelectedProvince("")
      setHoveredProvince("")
    }
  }, [selectedProvince, selectedRegion, provinceMetaMap])

  const selectedPlaces = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return places
      .filter((place) => {
        const provinceMeta = provinceMetaMap.get(place.province)
        const regionPass = selectedRegion === "all" ? true : provinceMeta?.region === selectedRegion
        const provincePass = selectedProvince ? place.province === selectedProvince : true
        return regionPass && provincePass
      })
      .filter((place) =>
        keyword
          ? `${place.province} ${place.name} ${place.description}`.toLowerCase().includes(keyword)
          : true,
      )
      .slice(0, 12)
  }, [places, provinceMetaMap, selectedRegion, selectedProvince, query])

  const regionStats = useMemo(() => {
    const countMap = new Map<Exclude<Region, "all">, number>([
      ["north", 0],
      ["northeast", 0],
      ["central", 0],
      ["south", 0],
    ])

    for (const province of provinceSummary) {
      countMap.set(province.region, (countMap.get(province.region) ?? 0) + 1)
    }

    return countMap
  }, [provinceSummary])

  const resolveProvinceName = (feature: FeatureLike) => {
    const featureName = feature.properties?.name?.trim() ?? ""
    const mappedProvince = ENGLISH_TO_THAI_PROVINCE[featureName]

    if (mappedProvince && provinceMetaMap.has(mappedProvince)) {
      return mappedProvince
    }

    const aliasProvince = PROVINCE_ALIASES[featureName]
    if (aliasProvince && provinceMetaMap.has(aliasProvince)) {
      return aliasProvince
    }

    if (provinceMetaMap.has(featureName)) {
      return featureName
    }

    if (provinceCenters.size > 0) {
      const center = getFeatureCenter(feature)
      let nearestProvince = ""
      let nearestDistance = Number.POSITIVE_INFINITY

      for (const [province, provinceCenter] of provinceCenters) {
        const distance = Math.hypot(center.lat - provinceCenter.lat, center.lng - provinceCenter.lng)
        if (distance < nearestDistance) {
          nearestProvince = province
          nearestDistance = distance
        }
      }

      if (nearestProvince) {
        return nearestProvince
      }
    }

    return ""
  }

  const styleForProvince = (feature: FeatureLike) => {
    const provinceName = resolveProvinceName(feature)
    const provinceMeta = provinceMetaMap.get(provinceName)
    const provinceRegion = provinceMeta?.region
    const isSelected = provinceName !== "" && provinceName === selectedProvince
    const isHovered = provinceName !== "" && provinceName === hoveredProvince

    const regionColorHex = provinceRegion ? regionColor(provinceRegion) : "#64748b"

    const inRegion = selectedRegion === "all" || provinceRegion === selectedRegion

    return {
      fillColor: isSelected ? "#f97316" : regionColorHex,
      color: "#ffffff",
      weight: isSelected ? 2.4 : isHovered ? 1.8 : 1.2,
      fillOpacity: isSelected ? 0.95 : inRegion ? 0.86 : 0.24,
    }
  }

  const onEachProvince = (feature: FeatureLike, layer: InteractiveLayer) => {
    const provinceName = resolveProvinceName(feature)
    if (!provinceName || !layer) {
      return
    }

    layer.bindTooltip(provinceName, {
      permanent: false,
      sticky: true,
      direction: "top",
      className: "th-province-hover-label",
      opacity: 0.95,
    })

    layer.on({
      mouseover: () => {
        setHoveredProvince(provinceName)
      },
      mouseout: () => {
        setHoveredProvince("")
      },
      click: () => {
        const provinceMeta = provinceMetaMap.get(provinceName)
        if (provinceMeta && selectedRegion !== "all" && provinceMeta.region !== selectedRegion) {
          setSelectedRegion(provinceMeta.region)
        }
        setSelectedProvince(provinceName)
      },
    })
  }

  return (
    <section className="bg-slate-200 py-4 md:py-6">
      <div className="mx-auto max-w-[1280px] px-2 md:px-4">
        <div className="relative h-[86vh] min-h-[640px] overflow-hidden rounded-2xl border border-white/80 bg-slate-300 shadow-xl shadow-slate-500/20">
          <MapContainer
            center={THAILAND_CENTER}
            zoom={6}
            minZoom={5}
            maxZoom={8}
            scrollWheelZoom
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full"
            style={{ backgroundColor: "#cbd5e1" }}
          >
            <FitThailandBounds data={geoData} />
            {geoData && (
              <GeoJSON
                key={`${selectedProvince}-${selectedRegion}`}
                data={geoData as unknown as GeoJsonObject}
                style={styleForProvince as StyleFunction<PathOptions>}
                onEachFeature={onEachProvince}
              />
            )}
          </MapContainer>

          <Card className="absolute left-3 top-3 z-[999] w-[360px] border-slate-200 bg-white/96 shadow-xl backdrop-blur md:left-5 md:top-5">
            <CardContent className="space-y-3 p-4">
              <div>
                <CardTitle className="text-base text-slate-900">แผนที่ท่องเที่ยวประเทศไทย (4 ภาค)</CardTitle>
                <p className="text-xs text-slate-500">คลิกจังหวัดบนแผนที่เพื่อดูสถานที่แนะนำ</p>
              </div>

              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหาจังหวัดหรือสถานที่..."
                className="h-9 border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400"
              />

              <div className="grid grid-cols-2 gap-1.5">
                {(["all", "north", "northeast", "central", "south"] as Region[]).map((region) => {
                  const isActive = selectedRegion === region
                  const provinceCount =
                    region === "all"
                      ? provinceSummary.length
                      : (regionStats.get(region as Exclude<Region, "all">) ?? 0)

                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(region)
                        if (region === "all") {
                          return
                        }
                        setSelectedProvince("")
                        setHoveredProvince("")
                      }}
                      className={`rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                        isActive
                          ? "border-orange-300 bg-orange-100 text-orange-700"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {regionLabel(region)} ({provinceCount})
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="bg-slate-100 text-[11px] text-slate-700">
                  จังหวัด {filteredProvinces.length}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100 text-[11px] text-slate-700">
                  สถานที่ {places.length}
                </Badge>
                {selectedProvince && (
                  <Badge variant="secondary" className="bg-orange-100 text-[11px] text-orange-700">
                    {selectedProvince}
                  </Badge>
                )}
              </div>

              {isLoading && <p className="text-xs text-slate-500">กำลังโหลดข้อมูล...</p>}
              {error && <p className="text-xs text-red-500">{error}</p>}

              {!isLoading && !error && (
                <>
                  <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-1.5">
                    {filteredProvinces.map((province) => (
                      <button
                        key={province.province}
                        type="button"
                        onClick={() => setSelectedProvince(province.province)}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs ${
                          province.province === selectedProvince
                            ? "bg-orange-500/20 text-orange-700"
                            : "text-slate-700 hover:bg-slate-200/80"
                        }`}
                      >
                        <span>{province.province}</span>
                        <span>{province.placeCount}</span>
                      </button>
                    ))}
                  </div>

                  <div className="max-h-44 space-y-1.5 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                    {selectedPlaces.slice(0, 6).map((place) => (
                      <div key={place.id} className="rounded-md border border-slate-200 bg-white p-2.5">
                        <p className="text-xs font-semibold text-slate-800">{place.name}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">{place.category}</p>
                      </div>
                    ))}
                    {selectedPlaces.length === 0 && <p className="text-xs text-slate-500">ไม่พบข้อมูล</p>}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
