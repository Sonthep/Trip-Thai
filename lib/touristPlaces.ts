import { TRIPS } from "@/lib/trips"

export type TouristPlace = {
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

type PlaceTemplate = {
  namePrefix: string
  category: TouristPlace["category"]
  description: string
}

const PLACE_TEMPLATES: PlaceTemplate[] = [
  {
    namePrefix: "แลนด์มาร์กเมือง",
    category: "culture",
    description: "จุดเช็กอินหลักของจังหวัด เหมาะสำหรับเริ่มต้นทริปและถ่ายรูป",
  },
  {
    namePrefix: "วัดเด่นประจำจังหวัด",
    category: "temple",
    description: "วัดชื่อดังบรรยากาศสงบ เดินทางง่าย เหมาะกับสายบุญและสายถ่ายภาพ",
  },
  {
    namePrefix: "จุดชมวิว",
    category: "viewpoint",
    description: "จุดชมพระอาทิตย์ขึ้นหรือพระอาทิตย์ตก วิวสวยเหมาะกับการพักผ่อน",
  },
  {
    namePrefix: "ตลาดท้องถิ่น",
    category: "food",
    description: "แหล่งรวมอาหารและของฝากประจำจังหวัด เดินเล่นได้ทั้งครอบครัว",
  },
]

function normalize(value: string) {
  return value.trim().toLowerCase()
}

const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา",
  "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
  "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน",
  "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา",
  "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต",
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยะลา", "ยโสธร", "ระนอง", "ระยอง", "ราชบุรี", "ร้อยเอ็ด",
  "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี",
  "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี",
] as const

const PROVINCE_ALIASES: Record<string, string> = {
  กรุงเทพมหานคร: "กรุงเทพมหานคร",
  กรุงเทพ: "กรุงเทพมหานคร",
  อยุธยา: "พระนครศรีอยุธยา",
}

function fallbackCoordinateFromProvince(province: string) {
  const seed = province.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const lat = 13.2 + ((seed % 61) - 30) * 0.1
  const lng = 100.8 + ((seed % 71) - 35) * 0.1

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  }
}

function resolveProvinceCoordinate(province: string) {
  const normalizedProvince = PROVINCE_ALIASES[province] ?? province

  const matchedTrip = TRIPS.find((trip) => {
    const tripProvince = PROVINCE_ALIASES[trip.to] ?? trip.to
    return normalize(tripProvince) === normalize(normalizedProvince)
  })

  if (matchedTrip) {
    return matchedTrip.destinationLocation
  }

  return fallbackCoordinateFromProvince(normalizedProvince)
}

function uniqueProvinces() {
  return THAI_PROVINCES.map((province) => ({
    province,
    location: resolveProvinceCoordinate(province),
  }))
}

function toId(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9ก-๙-]/g, "")
    .toLowerCase()
}

function offsetCoordinate(base: { lat: number; lng: number }, index: number) {
  const latOffset = (index - 1.5) * 0.045
  const lngOffset = (1.5 - index) * 0.052

  return {
    lat: Number((base.lat + latOffset).toFixed(6)),
    lng: Number((base.lng + lngOffset).toFixed(6)),
  }
}

function buildNationwidePlaces() {
  const provinces = uniqueProvinces()
  const places: TouristPlace[] = []

  for (const { province, location } of provinces) {
    PLACE_TEMPLATES.forEach((template, index) => {
      const name = `${template.namePrefix}${province}`

      places.push({
        id: `${toId(province)}-${index + 1}`,
        province,
        name,
        category: template.category,
        description: template.description,
        location: offsetCoordinate(location, index),
      })
    })
  }

  return places
}

const ALL_PLACES = buildNationwidePlaces()

export function getAllTouristPlaces() {
  return ALL_PLACES
}

export function searchTouristPlaces(params: {
  province?: string
  q?: string
  category?: TouristPlace["category"]
  limit?: number
}) {
  const { province, q, category, limit = 100 } = params

  const normalizedProvince = province ? normalize(province) : ""
  const normalizedQuery = q ? normalize(q) : ""

  const filtered = ALL_PLACES.filter((place) => {
    const byProvince = normalizedProvince
      ? normalize(place.province).includes(normalizedProvince)
      : true

    const byQuery = normalizedQuery
      ? normalize(`${place.name} ${place.description}`).includes(normalizedQuery)
      : true

    const byCategory = category ? place.category === category : true

    return byProvince && byQuery && byCategory
  })

  return filtered.slice(0, Math.min(Math.max(limit, 1), 500))
}
