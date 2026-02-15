import { MapPinned, Car, BarChart3 } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: MapPinned,
    title: "Select Your Destination",
    description:
      "Choose your starting point and destination from hundreds of locations across Thailand, from bustling cities to hidden gems.",
  },
  {
    step: "02",
    icon: Car,
    title: "Enter Your Car Details",
    description:
      "Tell us about your vehicle type, fuel efficiency, and preferred fuel type to get the most accurate cost estimates.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Get Instant Budget Breakdown",
    description:
      "Receive a detailed breakdown of fuel costs, toll fees, estimated travel time, and total trip budget in seconds.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Plan your trip in 3 simple steps
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No complicated setup. Just pick, enter, and go.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] bg-border md:block" />
              )}

              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <item.icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
