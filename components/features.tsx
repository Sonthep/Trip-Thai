import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Route, Fuel, Calculator } from "lucide-react"

const features = [
  {
    icon: Route,
    title: "Smart Distance & Time Calculator",
    description:
      "Instantly calculate driving distance and estimated travel time between any two cities in Thailand, including popular routes and scenic detours.",
  },
  {
    icon: Fuel,
    title: "Fuel & Toll Cost Estimator",
    description:
      "Get accurate fuel cost estimates based on your car type and current gas prices, plus toll fees for expressways and motorways.",
  },
  {
    icon: Calculator,
    title: "Total Trip Budget Breakdown",
    description:
      "See a complete cost breakdown including fuel, tolls, accommodation suggestions, and daily expenses to plan your perfect budget.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to plan your trip
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Powerful tools designed to make your Thailand road trip planning
            effortless and accurate.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/60 bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-lg font-semibold text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
