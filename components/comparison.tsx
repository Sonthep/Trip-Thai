import { Card, CardContent } from "@/components/ui/card"
import { Check, X, MapPin } from "lucide-react"

const features = [
  { label: "ระยะทาง", google: true, trip: true },
  { label: "เวลาเดินทาง", google: true, trip: true },
  { label: "ค่าน้ำมัน", google: false, trip: true },
  { label: "ค่าทางด่วน", google: false, trip: true },
  { label: "ค่าอาหาร (ประมาณ)", google: false, trip: true },
  { label: "ค่าที่พัก (ประมาณ)", google: false, trip: true },
  { label: "งบรวมทั้งทริป", google: false, trip: true },
]

export function Comparison() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {"ทำไมต้อง TripThai?"}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"TripThai vs Google Maps"}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {"Google Maps บอกแค่เส้นทาง — TripThai บอกทุกอย่างที่ต้องรู้ก่อนออกเดินทาง"}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
          {/* Google Maps column */}
          <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/80">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-card-foreground">Google Maps</h3>
                  <p className="text-xs text-muted-foreground">{"แผนที่นำทาง"}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    {f.google ? (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 shadow-sm">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                        <X className="h-3.5 w-3.5 text-muted-foreground/40" />
                      </div>
                    )}
                    <span className={`text-sm font-medium ${f.google ? "text-card-foreground" : "text-muted-foreground/50"}`}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TripThai column */}
          <Card className="relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] shadow-lg ring-1 ring-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <CardContent className="p-6 relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/90 shadow-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-card-foreground">TripThai</h3>
                  <p className="text-xs font-semibold text-primary">{"วางแผนทริปครบจบในที่เดียว"}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 shadow-sm">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-card-foreground">
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Subtle corner glow */}
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
