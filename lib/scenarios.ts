export type Scenario = {
  id: string
  label: string
  description: string
  totalCost: number
  travelTime: string
  travelTimeHours: number
  transportCost: number
  accommodationCost: number
  dailyAverage: number
  convenienceScore: number
  environmentalImpact: "Low" | "Medium" | "High"
}

export const scenarios: Scenario[] = [
  {
    id: "drive",
    label: "Drive Own Car",
    description: "Full road trip with personal vehicle. Maximum flexibility and door-to-door convenience.",
    totalCost: 8400,
    travelTime: "9h 30m",
    travelTimeHours: 9.5,
    transportCost: 3200,
    accommodationCost: 3200,
    dailyAverage: 2800,
    convenienceScore: 4,
    environmentalImpact: "Medium",
  },
  {
    id: "flight-rental",
    label: "Flight + Rental Car",
    description: "Fly to destination, rent a car on arrival for local exploration.",
    totalCost: 11200,
    travelTime: "1h 15m",
    travelTimeHours: 1.25,
    transportCost: 5800,
    accommodationCost: 3200,
    dailyAverage: 3730,
    convenienceScore: 5,
    environmentalImpact: "High",
  },
  {
    id: "train-local",
    label: "Train + Local Transport",
    description: "Scenic overnight train with local songthaew and tuk-tuks at destination.",
    totalCost: 5600,
    travelTime: "12h 45m",
    travelTimeHours: 12.75,
    transportCost: 1400,
    accommodationCost: 2400,
    dailyAverage: 1870,
    convenienceScore: 3,
    environmentalImpact: "Low",
  },
]
