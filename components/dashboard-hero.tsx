import { Zap } from "lucide-react"

export function DashboardHero() {
  return (
    <section className="border-b border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent">Trip Optimization Engine</span>
          </div>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Optimize Your Trip Budget Across Thailand
          </h1>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Compare travel modes, accommodation, and total cost in one intelligent dashboard.
          </p>
        </div>
      </div>
    </section>
  )
}
