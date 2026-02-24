import { TRIPS } from "@/lib/trips"

export type TripCalculationInput = {
  origin: string
  destination: string
  stops?: string[]
  autoOptimizeStops?: boolean
  days: number
  people: number
  kmPerLiter: number
  fuelPrice: number
}

export type TripSegment = {
  from: string
  to: string
  distance_km: number
  duration_hours: number
  toll_cost: number
}

export type TripCalculationResult = {
  distance_km: number
  duration_hours: number
  fuel_cost: number
  toll_cost: number
  food_cost: number
  accommodation_cost: number
  total_cost: number
  ordered_stops: string[]
  route_plan: string[]
  segments: TripSegment[]
}

type MockRoute = {
  id: string
  origin: string
  destination: string
  distance_km: number
  duration_hours: number
  toll_cost: number
}

// Mock route data – this would normally come from an external routing API.
const MOCK_ROUTES: MockRoute[] = [
  {
    id: "bkk-chiangmai",
    origin: "กรุงเทพ",
    destination: "เชียงใหม่",
    distance_km: 700,
    duration_hours: 9.5,
    toll_cost: 320,
  },
  {
    id: "bkk-pattaya",
    origin: "กรุงเทพ",
    destination: "พัทยา",
    distance_km: 150,
    duration_hours: 2.5,
    toll_cost: 120,
  },
  {
    id: "bkk-kanchanaburi",
    origin: "กรุงเทพ",
    destination: "กาญจนบุรี",
    distance_km: 130,
    duration_hours: 2.3,
    toll_cost: 80,
  },
]

function normalizePlace(value: string) {
  return value.trim().toLowerCase()
}

const BANGKOK_COORDINATE = { lat: 13.7563, lng: 100.5018 }

const PLACE_ALIASES: Record<string, string> = {
  กรุงเทพมหานคร: "กรุงเทพ",
  "bangkok": "กรุงเทพ",
}

type PlaceCoordinate = {
  lat: number
  lng: number
}

function buildPlaceCoordinateMap() {
  const map = new Map<string, PlaceCoordinate>()

  for (const trip of TRIPS) {
    map.set(normalizePlace(trip.from), trip.originLocation)
    map.set(normalizePlace(trip.to), trip.destinationLocation)
  }

  map.set(normalizePlace("กรุงเทพ"), BANGKOK_COORDINATE)

  return map
}

const PLACE_COORDINATES = buildPlaceCoordinateMap()

function sanitizePlaceName(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  const alias = PLACE_ALIASES[trimmed]
  return alias ?? trimmed
}

function pseudoCoordinateFromName(place: string): PlaceCoordinate {
  const seed = place.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const lat = 13.5 + ((seed % 45) - 22) * 0.12
  const lng = 100.5 + ((seed % 55) - 27) * 0.12

  return {
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4)),
  }
}

function getPlaceCoordinate(place: string): PlaceCoordinate {
  const sanitized = sanitizePlaceName(place)
  if (!sanitized) {
    return BANGKOK_COORDINATE
  }

  const known = PLACE_COORDINATES.get(normalizePlace(sanitized))
  return known ?? pseudoCoordinateFromName(sanitized)
}

function haversineDistanceKm(a: PlaceCoordinate, b: PlaceCoordinate) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const earthRadius = 6371

  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const value =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2)

  const arc = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
  return earthRadius * arc
}

function estimateSegment(origin: string, destination: string) {
  const route = findMockRoute(origin, destination)
  if (route) {
    return {
      distance_km: Math.round(route.distance_km),
      duration_hours: Number(route.duration_hours.toFixed(1)),
      toll_cost: Math.round(route.toll_cost),
    }
  }

  const originCoordinate = getPlaceCoordinate(origin)
  const destinationCoordinate = getPlaceCoordinate(destination)
  const directDistance = haversineDistanceKm(originCoordinate, destinationCoordinate)
  const roadDistance = Math.max(25, Math.round(directDistance * 1.28))
  const duration = Number((roadDistance / 75).toFixed(1))

  const toll =
    roadDistance <= 90 ? 0 :
    roadDistance <= 220 ? Math.round(roadDistance * 0.55) :
    Math.round(roadDistance * 0.75)

  return {
    distance_km: roadDistance,
    duration_hours: duration,
    toll_cost: toll,
  }
}

function normalizeStops(stops: string[] | undefined, origin: string, destination: string) {
  const seen = new Set<string>()
  const normalizedOrigin = normalizePlace(origin)
  const normalizedDestination = normalizePlace(destination)

  const result: string[] = []

  for (const rawStop of stops ?? []) {
    const stop = sanitizePlaceName(rawStop)
    if (!stop) continue

    const normalizedStop = normalizePlace(stop)
    if (normalizedStop === normalizedOrigin || normalizedStop === normalizedDestination) continue
    if (seen.has(normalizedStop)) continue

    seen.add(normalizedStop)
    result.push(stop)
  }

  return result
}

function sortStopsByNearestNeighbor(origin: string, stops: string[]) {
  const remaining = [...stops]
  const sorted: string[] = []
  let current = origin

  while (remaining.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    for (let index = 0; index < remaining.length; index += 1) {
      const candidate = remaining[index]
      const candidateDistance = estimateSegment(current, candidate).distance_km

      if (candidateDistance < nearestDistance) {
        nearestDistance = candidateDistance
        nearestIndex = index
      }
    }

    const [nextStop] = remaining.splice(nearestIndex, 1)
    sorted.push(nextStop)
    current = nextStop
  }

  return sorted
}

function findMockRoute(origin: string, destination: string): MockRoute | null {
  const normalizedOrigin = normalizePlace(origin)
  const normalizedDestination = normalizePlace(destination)

  const directMatch =
    MOCK_ROUTES.find(
      (route) =>
        normalizePlace(route.origin) === normalizedOrigin &&
        normalizePlace(route.destination) === normalizedDestination,
    ) ??
    MOCK_ROUTES.find(
      (route) =>
        normalizePlace(route.origin) === normalizedDestination &&
        normalizePlace(route.destination) === normalizedOrigin,
    )

  return directMatch ?? null
}

export function calculateTrip(input: TripCalculationInput): TripCalculationResult {
  const safeOrigin = sanitizePlaceName(input.origin) || "กรุงเทพ"
  const safeDestination = sanitizePlaceName(input.destination) || "เชียงใหม่"

  const safeDays = Number.isFinite(input.days) && input.days > 0 ? input.days : 1
  const safePeople = Number.isFinite(input.people) && input.people > 0 ? input.people : 1
  const safeKmPerLiter = Number.isFinite(input.kmPerLiter) && input.kmPerLiter > 0 ? input.kmPerLiter : 12
  const safeFuelPrice = Number.isFinite(input.fuelPrice) && input.fuelPrice > 0 ? input.fuelPrice : 38

  const sanitizedStops = normalizeStops(input.stops, safeOrigin, safeDestination)
  const orderedStops =
    input.autoOptimizeStops === false
      ? sanitizedStops
      : sortStopsByNearestNeighbor(safeOrigin, sanitizedStops)

  const routePlan = [safeOrigin, ...orderedStops, safeDestination]

  const segments: TripSegment[] = []
  for (let index = 0; index < routePlan.length - 1; index += 1) {
    const from = routePlan[index]
    const to = routePlan[index + 1]
    const estimated = estimateSegment(from, to)

    segments.push({
      from,
      to,
      distance_km: estimated.distance_km,
      duration_hours: estimated.duration_hours,
      toll_cost: estimated.toll_cost,
    })
  }

  const distance_km = segments.reduce((sum, segment) => sum + segment.distance_km, 0)
  const duration_hours = Number(
    segments.reduce((sum, segment) => sum + segment.duration_hours, 0).toFixed(1),
  )
  const toll_cost = segments.reduce((sum, segment) => sum + segment.toll_cost, 0)

  const fuel_cost = (distance_km / safeKmPerLiter) * safeFuelPrice
  const food_cost = safeDays * safePeople * 300
  const accommodation_nights = Math.max(safeDays - 1, 0)
  const accommodation_cost = accommodation_nights * 1200

  const total_cost = fuel_cost + toll_cost + food_cost + accommodation_cost

  const round = (value: number) => Math.round(value)

  return {
    distance_km: Math.round(distance_km),
    duration_hours,
    fuel_cost: round(fuel_cost),
    toll_cost: round(toll_cost),
    food_cost: round(food_cost),
    accommodation_cost: round(accommodation_cost),
    total_cost: round(total_cost),
    ordered_stops: orderedStops,
    route_plan: routePlan,
    segments,
  }
}

