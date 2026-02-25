"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { CircleMarker, GeoJSON, MapContainer, Tooltip, useMap } from "react-leaflet"
import { Input } from "@/components/ui/input"
import { TRIPS } from "@/lib/trips"

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
  imageUrl?: string
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

type InteractiveLayer = {
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
  const [selectedCategory, setSelectedCategory] = useState<TouristPlace["category"] | "all">("all")
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null)
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
        const categoryPass = selectedCategory === "all" ? true : place.category === selectedCategory
        return regionPass && provincePass && categoryPass
      })
      .filter((place) =>
        keyword
          ? `${place.province} ${place.name} ${place.description}`.toLowerCase().includes(keyword)
          : true,
      )
      .slice(0, 24)
  }, [places, provinceMetaMap, selectedRegion, selectedProvince, selectedCategory, query])

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

  const REGION_PILL_COLORS: Record<Region, string> = {
    all: "bg-slate-900 text-white border-slate-900",
    north: "bg-amber-500 text-white border-amber-500",
    northeast: "bg-orange-500 text-white border-orange-500",
    central: "bg-sky-500 text-white border-sky-500",
    south: "bg-rose-500 text-white border-rose-500",
  }

  const CATEGORY_ICONS: Record<TouristPlace["category"], string> = {
    nature: "🌿",
    temple: "🛕",
    culture: "🎭",
    food: "🍜",
    beach: "🏖️",
    viewpoint: "🌅",
  }

  const CATEGORY_COLORS: Record<TouristPlace["category"], string> = {
    nature: "#22c55e",
    temple: "#f59e0b",
    culture: "#8b5cf6",
    food: "#ef4444",
    beach: "#06b6d4",
    viewpoint: "#f97316",
  }

  const CATEGORIES: { value: TouristPlace["category"] | "all"; label: string; icon: string }[] = [
    { value: "all", label: "ทั้งหมด", icon: "🗺️" },
    { value: "nature", label: "ธรรมชาติ", icon: "🌿" },
    { value: "temple", label: "วัด", icon: "🛕" },
    { value: "culture", label: "วัฒนธรรม", icon: "🎭" },
    { value: "food", label: "อาหาร", icon: "🍜" },
    { value: "beach", label: "หาด/ทะเล", icon: "🏖️" },
    { value: "viewpoint", label: "จุดชมวิว", icon: "🌅" },
  ]

  const selectedProvinceMeta = selectedProvince ? provinceMetaMap.get(selectedProvince) : null

  // Find trips that involve the selected province
  const provinceTrips = useMemo(() => {
    if (!selectedProvince) return []
    const norm = (s: string) => s.replace(/จังหวัด/g, "").trim()
    const prov = norm(selectedProvince)
    return TRIPS.filter((t) => {
      const from = norm(t.from)
      const to = norm(t.to)
      return from.includes(prov) || prov.includes(from) || to.includes(prov) || prov.includes(to)
    }).slice(0, 4)
  }, [selectedProvince])

  return (
    <section id="explore" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">

        {/* Section header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Explore Thailand
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            77 จังหวัด · 4 ภาค · ไม่รู้จะไปไหนดี?
          </h2>
          <p className="mt-4 text-pretty text-slate-500">
            คลิกจังหวัดบนแผนที่เพื่อดูสถานที่แนะนำ กรองตามภาค หรือค้นหาตามสิ่งที่อยากเห็น
          </p>
        </div>

        {/* Category filter chips */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => { setSelectedCategory(cat.value); setSelectedPlace(null) }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Split-column layout: sidebar + map */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">

          {/* LEFT PANEL — control sidebar */}
          <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">

            {/* Search */}
            <div>
              <label htmlFor="province-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                ค้นหา
              </label>
              <Input
                id="province-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="จังหวัด หรือสถานที่..."
                className="border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-orange-400"
              />
            </div>

            {/* Region filter pills */}
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                กรองตามภาค
              </p>
              <div className="flex flex-wrap gap-2">
                {(["all", "north", "northeast", "central", "south"] as Region[]).map((region) => {
                  const isActive = selectedRegion === region
                  const count =
                    region === "all"
                      ? provinceSummary.length
                      : (regionStats.get(region as Exclude<Region, "all">) ?? 0)
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(region)
                        setSelectedProvince("")
                        setHoveredProvince("")
                      }}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? REGION_PILL_COLORS[region]
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      {regionLabel(region)}
                      <span className="ml-1.5 opacity-70">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedPlace ? (
              /* ── Place Detail Panel ─────────────────────────── */
              <div className="flex flex-1 flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  กลับไป{selectedProvince ? `จังหวัด${selectedProvince}` : รายการ}
                </button>

                {/* Photo */}
                {selectedPlace.imageUrl ? (
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-200">
                    <img
                      src={selectedPlace.imageUrl}
                      alt={selectedPlace.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-5xl">
                    {CATEGORY_ICONS[selectedPlace.category]}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 ring-1 ring-orange-200">
                    {CATEGORY_ICONS[selectedPlace.category]} {selectedPlace.category === "nature" ? "ธรรมชาติ" : selectedPlace.category === "temple" ? "วัด" : selectedPlace.category === "culture" ? "วัฒนธรรม" : selectedPlace.category === "food" ? "อาหาร" : selectedPlace.category === "beach" ? "หาด/ทะเล" : "จุดชมวิว"}
                  </span>
                  <span className="text-xs text-slate-400">{selectedPlace.province}</span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-slate-900">{selectedPlace.name}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{selectedPlace.description}</p>

                {/* CTA */}
                <Link
                  href={`/?from=กรุงเทพ&to=${encodeURIComponent(selectedPlace.province)}#quick-planner`}
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all hover:bg-orange-600"
                >
                  วางแผนทริป {selectedPlace.province}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : selectedProvince ? (
              /* ── Province Detail Panel ─────────────────────── */
              <div className="flex flex-1 flex-col gap-4">
                {/* Back + province header */}
                <div>
                  <button
                    type="button"
                    onClick={() => { setSelectedProvince(""); setHoveredProvince("") }}
                    className="mb-3 flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    กลับ
                  </button>
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">จังหวัดที่เลือก</p>
                    <p className="mt-0.5 text-xl font-bold text-slate-900">{selectedProvince}</p>
                    {selectedProvinceMeta && (
                      <p className="text-xs text-slate-500">
                        {regionLabel(selectedProvinceMeta.region)} · {selectedProvinceMeta.placeCount} สถานที่
                      </p>
                    )}
                  </div>
                </div>

                {/* Highlight places */}
                {selectedPlaces.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      สถานที่แนะนำ ({selectedPlaces.length} แห่ง)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPlaces.slice(0, 8).map((place) => (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => setSelectedPlace(place)}
                          className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 text-left transition-all hover:border-orange-300 hover:shadow-md"
                        >
                          {place.imageUrl ? (
                            <div className="relative h-20 w-full overflow-hidden bg-slate-200">
                              <img
                                src={place.imageUrl}
                                alt={place.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white drop-shadow">
                                {CATEGORY_ICONS[place.category]}
                              </span>
                            </div>
                          ) : (
                            <div className="flex h-20 items-center justify-center bg-slate-100 text-2xl">
                              {CATEGORY_ICONS[place.category]}
                            </div>
                          )}
                          <div className="px-2 py-1.5">
                            <p className="line-clamp-2 text-[11px] font-medium leading-snug text-slate-700">{place.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching routes */}
                <div className="flex-1">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    เส้นทางที่มี{selectedProvince}
                  </p>
                  {provinceTrips.length > 0 ? (
                    <div className="space-y-2">
                      {provinceTrips.map((trip) => (
                        <Link
                          key={trip.slug}
                          href={`/trip/${trip.slug}`}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition-all hover:border-orange-200 hover:bg-orange-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{trip.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {trip.distanceKm} กม. · {trip.featured.budgetLabel}
                            </p>
                          </div>
                          <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-orange-400" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
                      ยังไม่มีเส้นทางสำเร็จรูปสำหรับจังหวัดนี้
                    </p>
                  )}
                </div>

                {/* Sticky CTA */}
                <Link
                  href={`/?from=กรุงเทพ&to=${encodeURIComponent(selectedProvince)}#quick-planner`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all hover:bg-orange-600"
                >
                  วางแผนทริป {selectedProvince}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              /* ── Default: province list ────────────────────── */
              <>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-400">
                  คลิกจังหวัดบนแผนที่หรือในรายการด้านล่าง
                </div>

                {/* Province list */}
                <div className="flex-1">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    รายชื่อจังหวัด ({filteredProvinces.length})
                  </p>
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-9 animate-pulse rounded-xl bg-slate-100" />
                      ))}
                    </div>
                  ) : (
                    <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                      {filteredProvinces.map((province) => {
                        const isActive = province.province === selectedProvince
                        return (
                          <button
                            key={province.province}
                            type="button"
                            onClick={() => setSelectedProvince(province.province)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all duration-100 ${
                              isActive
                                ? "bg-orange-500 font-semibold text-white shadow-md shadow-orange-200"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{province.province}</span>
                            <span className={`text-xs ${isActive ? "text-orange-100" : "text-slate-400"}`}>
                              {province.placeCount} แห่ง
                            </span>
                          </button>
                        )
                      })}
                      {filteredProvinces.length === 0 && (
                        <p className="py-4 text-center text-xs text-slate-400">ไม่พบจังหวัดที่ตรงกัน</p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-500">{error}</p>}
          </div>

          {/* RIGHT PANEL — map */}
          <div className="relative min-h-[540px] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300/50 lg:min-h-0">

            {/* Region legend */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-[999] flex flex-col gap-1.5 rounded-2xl border border-white/70 bg-white/80 px-3 py-2.5 backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">ภาค</p>
              {(["north", "northeast", "central", "south"] as Exclude<Region, "all">[]).map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: regionColor(r) }} />
                  <span className="text-[11px] text-slate-700">{regionLabel(r)}</span>
                </div>
              ))}
            </div>

            {/* Province hover callout */}
            {(selectedProvince || hoveredProvince) && (
              <div className="pointer-events-none absolute right-4 top-4 z-[999] max-w-[200px] rounded-2xl border border-white/60 bg-white/90 px-3.5 py-2.5 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {hoveredProvince ? "ชี้ที่จังหวัด" : "เลือกแล้ว"}
                </p>
                <p className="text-base font-bold text-slate-900">{hoveredProvince || selectedProvince}</p>
              </div>
            )}

            <MapContainer
              center={THAILAND_CENTER}
              zoom={6}
              minZoom={5}
              maxZoom={8}
              scrollWheelZoom
              zoomControl={false}
              attributionControl={false}
              className="h-[640px] w-full"
              style={{ backgroundColor: "#e2e8f0" }}
            >
              <FitThailandBounds data={geoData} />
              {geoData && (
                <GeoJSON
                  key={`${selectedProvince}-${selectedRegion}`}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data={geoData as any}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={styleForProvince as any}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onEachFeature={onEachProvince as any}
                />
              )}
              {/* Place markers */}
              {selectedPlaces.map((place) => (
                <CircleMarker
                  key={place.id}
                  center={[place.location.lat, place.location.lng]}
                  radius={8}
                  pathOptions={{
                    fillColor: CATEGORY_COLORS[place.category],
                    color: "#fff",
                    weight: 2,
                    fillOpacity: selectedPlace?.id === place.id ? 1 : 0.85,
                  }}
                  eventHandlers={{ click: () => setSelectedPlace(place) }}
                >
                  <Tooltip sticky>{place.name}</Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
                  <p className="mt-3 text-sm font-medium text-slate-500">กำลังโหลดแผนที่...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}