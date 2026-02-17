import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Plane, TrainFront, Check, X, Leaf } from "lucide-react"

type ModeData = {
  mode: string
  icon: React.ComponentType<{ className?: string }>
  totalCost: string
  duration: string
  pros: string[]
  cons: string[]
  co2: "Low" | "Medium" | "High"
  co2Color: string
}

const modes: ModeData[] = [
  {
    mode: "Car",
    icon: Car,
    totalCost: "4,500 THB",
    duration: "9-10 hours",
    pros: ["Flexible schedule", "Door-to-door", "Can split fuel costs"],
    cons: ["Long drive fatigue", "Toll & fuel costs", "Parking hassle"],
    co2: "Medium",
    co2Color: "text-chart-4",
  },
  {
    mode: "Flight",
    icon: Plane,
    totalCost: "2,800 THB",
    duration: "1-1.5 hours",
    pros: ["Fastest option", "Comfortable", "No road fatigue"],
    cons: ["Airport transfers", "Baggage limits", "Fixed schedule"],
    co2: "High",
    co2Color: "text-destructive",
  },
  {
    mode: "Train",
    icon: TrainFront,
    totalCost: "1,200 THB",
    duration: "12-14 hours",
    pros: ["Most affordable", "Scenic journey", "Low emissions"],
    cons: ["Slow travel", "Limited routes", "Schedule dependent"],
    co2: "Low",
    co2Color: "text-primary",
  },
]

export function ModeComparison() {
  return (
    <section className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
        <div className="mb-8 flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Side-by-Side Comparison
          </h2>
          <p className="text-sm text-muted-foreground">
            Bangkok to Chiang Mai &mdash; estimated costs for a single traveler
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modes.map((m) => {
            const Icon = m.icon
            return (
              <Card key={m.mode} className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      {m.mode}
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {m.totalCost}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {/* Duration */}
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <span className="text-sm font-medium text-foreground">{m.duration}</span>
                  </div>

                  {/* Pros */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Pros</span>
                    {m.pros.map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <Check className="h-3 w-3 shrink-0 text-primary" />
                        <span className="text-xs text-foreground">{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cons */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Cons</span>
                    {m.cons.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <X className="h-3 w-3 shrink-0 text-destructive" />
                        <span className="text-xs text-foreground">{c}</span>
                      </div>
                    ))}
                  </div>

                  {/* CO2 */}
                  <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <Leaf className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">CO2 Impact</span>
                    </div>
                    <span className={`text-xs font-semibold ${m.co2Color}`}>
                      {m.co2}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
