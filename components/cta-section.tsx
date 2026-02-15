import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-lg sm:px-12 lg:px-20">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative z-10">
            <h2 className="font-display mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              Ready to hit the road?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-primary-foreground/80">
              Start planning your Thailand road trip today. It only takes a few
              seconds to get your complete trip budget.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-8 text-base font-semibold"
              >
                Plan Your First Trip Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
