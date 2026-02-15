import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center lg:px-6 lg:pb-28 lg:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Smart trip planning for Thailand</span>
        </div>

        <h1 className="font-display max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Plan Your Road Trip Across Thailand in Seconds
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Calculate travel time, fuel cost, and total trip budget instantly.
          From Bangkok to Chiang Mai, plan every detail of your adventure.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 px-8 text-base">
            Start Planning
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2 px-8 text-base">
            See How It Works
          </Button>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid w-full max-w-2xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-1 px-4">
            <span className="font-display text-2xl font-bold text-foreground md:text-3xl">
              500+
            </span>
            <span className="text-xs text-muted-foreground md:text-sm">
              Routes Covered
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <span className="font-display text-2xl font-bold text-foreground md:text-3xl">
              10K+
            </span>
            <span className="text-xs text-muted-foreground md:text-sm">
              Trips Planned
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <span className="font-display text-2xl font-bold text-foreground md:text-3xl">
              98%
            </span>
            <span className="text-xs text-muted-foreground md:text-sm">
              Accuracy Rate
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
