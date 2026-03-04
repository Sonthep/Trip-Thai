"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown, ArrowRight, ArrowUp, ChevronLeft, Copy, MapPin, Plus, Trash2, X } from "lucide-react"
import L from "leaflet"
import { GeoJSON, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet"
import { Input } from "@/components/ui/input"
import { PlaceImage } from "@/components/place-image"
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

// Hardcoded Thailand bounding box — avoids GeoJSON outlier coordinates zooming out map
const THAILAND_BOUNDS: [[number, number], [number, number]] = [
  [5.5, 97.5],   // SW: southern tip near Malaysia
  [20.5, 105.7], // NE: Chiang Rai / Mekong corner
]

function FitThailandBounds({ data }: { data: FeatureCollectionLike | null }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (!data || fitted.current) return
    fitted.current = true
    map.fitBounds(THAILAND_BOUNDS, { padding: [16, 16], animate: false })
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
  const [planPlaces, setPlanPlaces] = useState<TouristPlace[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem("trip-thai-plan")
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showPlan, setShowPlan] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list")

  // Persist plan to localStorage
  useEffect(() => {
    try { localStorage.setItem("trip-thai-plan", JSON.stringify(planPlaces)) } catch {}
  }, [planPlaces])
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
          fetch("/api/tourist-places?limit=1000"),
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

  const selectedPlaces: TouristPlace[] = useMemo(() => {
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
        keyword ? `${place.province} ${place.name} ${place.description}`.toLowerCase().includes(keyword) : true,
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
    nature: "#16a34a",
    temple: "#d97706",
    culture: "#7c3aed",
    food: "#dc2626",
    beach: "#0891b2",
    viewpoint: "#ea580c",
  }

  function makeCategoryIcon(category: TouristPlace["category"], inPlan: boolean) {
    const emoji = CATEGORY_ICONS[category]
    const bg = CATEGORY_COLORS[category]
    const border = inPlan ? "#f97316" : "rgba(255,255,255,0.95)"
    const shadow = inPlan ? "0 0 0 3px #f97316,0 3px 10px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.30)"
    return L.divIcon({
      html: `<div style="background:${bg};border:2.5px solid ${border};border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:${shadow};cursor:pointer;transition:transform 0.15s">${emoji}</div>`,
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      tooltipAnchor: [0, -18],
    })
  }

  function makePlanIcon(index: number) {
    return L.divIcon({
      html: `<div style="background:#f97316;border:2.5px solid white;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:white;box-shadow:0 2px 8px rgba(249,115,22,0.6);cursor:pointer">${index + 1}</div>`,
      className: "",
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      tooltipAnchor: [0, -16],
    })
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

  function addToPlan(place: TouristPlace) {
    setPlanPlaces((prev) =>
      prev.find((p) => p.id === place.id) ? prev : [...prev, place]
    )
    setShowPlan(true)
  }

  function removeFromPlan(id: string) {
    setPlanPlaces((prev) => prev.filter((p) => p.id !== id))
  }

  function movePlanPlace(id: string, dir: "up" | "down") {
    setPlanPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === id)
      if (idx < 0) return prev
      const next = [...prev]
      const swap = dir === "up" ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  function copyPlanLink() {
    const ids = planPlaces.map((p) => p.id).join(",")
    const url = `${window.location.origin}/explore?plan=${encodeURIComponent(ids)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // haversine straight-line distance in km
  function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  }

  const planTotalKm = useMemo(() => {
    if (planPlaces.length < 2) return 0
    let total = 0
    for (let i = 0; i < planPlaces.length - 1; i++) {
      total += haversineKm(planPlaces[i].location, planPlaces[i + 1].location)
    }
    return Math.round(total)
  }, [planPlaces])

  const planUniqueProvinces = useMemo(
    () => new Set(planPlaces.map((p) => p.province)).size,
    [planPlaces]
  )

  const selectedProvinceMeta = selectedProvince ? provinceMetaMap.get(selectedProvince) : null

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
            คลิกจังหวัดบนแผนที่เพื่อดูสถานที่แนะนำ กด เพิ่มในแผน เพื่อดูเส้นทางครบทุกจุดบนแผนที่
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
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}

        </div>



        {/* Mobile tab bar */}
        <div className="mb-4 flex overflow-hidden rounded-2xl border border-slate-200 bg-white lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              mobileTab === "list" ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            🗺️ รายการสถานที่
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
              mobileTab === "map" ? "bg-orange-500 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            📍 ดูแผนที่
          </button>
        </div>

        {/* Split-column layout: sidebar + map */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">

          {/* LEFT PANEL — control sidebar */}
          <div className={`flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 ${mobileTab === "map" ? "hidden lg:flex" : "flex"}`}>

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
              /* ── Place Detail Panel ───────────────────────── */
              <div className="flex flex-1 flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {selectedProvince ? `กลับไปจังหวัด${selectedProvince}` : "กลับรายการ"}
                </button>
                {/* Place detail image */}
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-200">
                  <PlaceImage
                    placeId={selectedPlace.id}
                    name={selectedPlace.name}
                    imageUrl={selectedPlace.imageUrl}
                    category={selectedPlace.category}
                    className="rounded-2xl"
                    fallbackClassName="h-48 rounded-2xl text-5xl"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 ring-1 ring-orange-200">
                    {CATEGORY_ICONS[selectedPlace.category]}
                  </span>
                  <span className="text-xs text-slate-400">{selectedPlace.province}</span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-slate-900">{selectedPlace.name}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{selectedPlace.description}</p>
                <button
                  type="button"
                  onClick={() => addToPlan(selectedPlace)}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                    planPlaces.some((p) => p.id === selectedPlace.id)
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600"
                  }`}
                >
                  {planPlaces.some((p) => p.id === selectedPlace.id) ? (
                    <>\u2713 อยู่ในแผนแล้ว</>
                  ) : (
                    <><Plus className="h-4 w-4" />เพิ่มสถานที่นี้ในแผน</>
                  )}
                </button>
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

                {/* Highlight places as chips */}
                {selectedPlaces.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      สถานที่แนะนำ
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPlaces.slice(0, 10).map((place: TouristPlace) => {
                        const inPlan = planPlaces.some((p: TouristPlace) => p.id === place.id)
                        return (
                          <div
                            key={place.id}
                            className={`overflow-hidden rounded-xl border bg-white text-left transition-all hover:shadow-md ${
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (selectedPlace as any)?.id === place.id ? "border-orange-400" : "border-slate-100"
                            }`}
                          >
                            <button type="button" className="w-full text-left" onClick={() => setSelectedPlace(place)}>
                              <div className="relative h-20 w-full overflow-hidden bg-slate-200">
                                <PlaceImage
                                  placeId={place.id}
                                  name={place.name}
                                  imageUrl={place.imageUrl}
                                  category={place.category}
                                  className=""
                                  fallbackClassName="h-20 text-2xl"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <span className="absolute bottom-1 left-2 text-[10px] font-medium text-white drop-shadow">
                                  {CATEGORY_ICONS[place.category]}
                                </span>
                              </div>
                              <p className="line-clamp-2 px-2 pt-1.5 text-[11px] font-medium leading-snug text-slate-700">{place.name}</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => addToPlan(place)}
                              className={`mt-1 flex w-full items-center justify-center gap-1 rounded-b-xl py-1.5 text-[11px] font-semibold transition-colors ${
                                inPlan
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                              }`}
                            >
                              {inPlan ? (
                                <>✓ อยู่ในแผนแล้ว</>
                              ) : (
                                <><Plus className="h-3 w-3" /> เพิ่มในแผน</>
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Sticky CTA */}
                <Link
                  href={`/trip/custom?origin=${encodeURIComponent("กรุงเทพมหานคร")}&destination=${encodeURIComponent(selectedProvince)}&people=2&kmPerLiter=12`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all hover:bg-orange-600"
                >
                  คำนวณงบทริป {selectedProvince}
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

            {/* ── Plan Basket (in sidebar) ─────────────────── */}
            {planPlaces.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50">
                {/* Header */}
                <button
                  type="button"
                  onClick={() => setShowPlan((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">
                      แผนของฉัน
                    </span>
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {planPlaces.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600">{showPlan ? "▲ ซ่อน" : "▼ ดู"}</span>
                </button>

                {showPlan && (
                  <div className="border-t border-emerald-100 px-4 pb-4 pt-3">
                    {/* Stats row */}
                    <div className="mb-3 flex gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-slate-700">{planPlaces.length}</span> สถานที่
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-slate-700">{planUniqueProvinces}</span> จังหวัด
                      </span>
                      {planTotalKm > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1">
                            ~<span className="font-semibold text-slate-700">{planTotalKm.toLocaleString()}</span> กม.
                          </span>
                        </>
                      )}
                    </div>

                    {/* Place rows with reorder */}
                    <div className="space-y-1.5">
                      {planPlaces.map((place, i) => (
                        <div key={place.id} className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-white px-2.5 py-1.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
                            {CATEGORY_ICONS[place.category]} {place.name}
                          </span>
                          <div className="flex shrink-0 items-center">
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => movePlanPlace(place.id, "up")}
                              className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={i === planPlaces.length - 1}
                              onClick={() => movePlanPlace(place.id, "down")}
                              className="rounded p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromPlan(place.id)}
                              className="rounded p-0.5 text-slate-300 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-col gap-2">
                      <Link
                        href={`/trip/custom?origin=${encodeURIComponent(planPlaces[0]?.province ?? "กรุงเทพ")}&destination=${encodeURIComponent(planPlaces[planPlaces.length - 1]?.province ?? "เชียงใหม่")}&people=2&kmPerLiter=15&places=${planPlaces.map((p) => p.id).join(",")}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 hover:bg-orange-600"
                      >
                        คำนวณงบทริปนี้ <ArrowRight className="h-4 w-4" />
                      </Link>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={copyPlanLink}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copied ? "คัดลอกแล้ว ✓" : "แชร์แผน"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setPlanPlaces([]); setShowPlan(false) }}
                          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:border-red-200 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> ล้าง
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL — map */}
          <div className={`relative h-[88vh] min-h-[680px] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300/50 lg:h-[88vh] lg:self-stretch ${mobileTab === "list" ? "hidden lg:block" : "block"}`}>

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
              maxZoom={13}
              maxBounds={[[3.5, 95.5], [22.5, 107.5]]}
              maxBoundsViscosity={0.85}
              scrollWheelZoom
              zoomControl
              attributionControl
              className="absolute inset-0 h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
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
                <Marker
                  key={place.id}
                  position={[place.location.lat, place.location.lng]}
                  icon={makeCategoryIcon(place.category, planPlaces.some((p) => p.id === place.id))}
                  eventHandlers={{ click: () => setSelectedPlace(place) }}
                >
                  <Tooltip direction="top" offset={[0, -18]}>{place.name}</Tooltip>
                </Marker>
              ))}
              {/* Route polyline for plan */}
              {planPlaces.length > 1 && (
                <Polyline
                  positions={planPlaces.map((p) => [p.location.lat, p.location.lng])}
                  pathOptions={{ color: "#f97316", weight: 3, dashArray: "8 6", opacity: 0.85 }}
                />
              )}
              {/* Plan place numbered markers */}
              {planPlaces.map((place, i) => (
                <Marker
                  key={`plan-${place.id}`}
                  position={[place.location.lat, place.location.lng]}
                  icon={makePlanIcon(i)}
                  eventHandlers={{ click: () => setSelectedPlace(place) }}
                >
                  <Tooltip permanent direction="top" offset={[0, -16]} className="plan-marker-label">{i + 1}</Tooltip>
                </Marker>
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