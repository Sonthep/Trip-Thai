export type TripCalculationInput = {
  origin: string
  destination: string
  days: number
  people: number
  kmPerLiter: number
  fuelPrice: number
}

export type TripCalculationResult = {
  distance_km: number
  duration_hours: number
  fuel_cost: number
  toll_cost: number
  food_cost: number
  accommodation_cost: number
  total_cost: number
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
  const safeDays = Number.isFinite(input.days) && input.days > 0 ? input.days : 1
  const safePeople = Number.isFinite(input.people) && input.people > 0 ? input.people : 1
  const safeKmPerLiter = Number.isFinite(input.kmPerLiter) && input.kmPerLiter > 0 ? input.kmPerLiter : 12
  const safeFuelPrice = Number.isFinite(input.fuelPrice) && input.fuelPrice > 0 ? input.fuelPrice : 38

  const route = findMockRoute(input.origin, input.destination)

  const distance_km = route?.distance_km ?? 400
  const duration_hours = route?.duration_hours ?? 6
  const toll_cost = route?.toll_cost ?? 150

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
  }
}

