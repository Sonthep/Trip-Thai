import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Route, Clock, Fuel } from "lucide-react"

export function MapPreview() {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Route Preview
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"ดูตัวอย่างเส้นทาง"}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {"กรุงเทพ → เชียงใหม่ เส้นทาง Road Trip ยอดฮิตของไทย"}
          </p>
        </div>

        <Card className="mt-14 overflow-hidden border-border/60 shadow-lg">
          <CardContent className="p-0">
            {/* Map illustration placeholder */}
            <div className="relative h-72 bg-[hsl(170,30%,95%)] sm:h-96">
              {/* Grid pattern for map feel */}
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <pattern id="map-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(170,20%,85%)" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#map-grid)" />

                {/* Route line */}
                <path
                  d="M 30% 75% Q 35% 55% 40% 50% T 50% 35% T 55% 25% T 50% 15%"
                  fill="none"
                  stroke="hsl(170,65%,36%)"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  strokeLinecap="round"
                />

                {/* Route dots along path */}
                <circle cx="30%" cy="75%" r="8" fill="hsl(24,90%,55%)" />
                <circle cx="30%" cy="75%" r="4" fill="white" />
                <circle cx="50%" cy="15%" r="8" fill="hsl(170,65%,36%)" />
                <circle cx="50%" cy="15%" r="4" fill="white" />

                {/* Intermediate stop */}
                <circle cx="42%" cy="45%" r="5" fill="hsl(170,65%,36%)" opacity="0.5" />
                <circle cx="42%" cy="45%" r="2.5" fill="white" />
              </svg>

              {/* City labels */}
              <div className="absolute left-[22%] top-[78%] flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-md sm:left-[24%]">
                <MapPin className="h-3 w-3 text-accent" />
                {"กรุงเทพ"}
              </div>
              <div className="absolute left-[42%] top-[6%] flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-md sm:left-[44%]">
                <MapPin className="h-3 w-3 text-primary" />
                {"เชียงใหม่"}
              </div>
              <div className="absolute left-[34%] top-[42%] flex items-center gap-1.5 rounded-full bg-card/80 px-2.5 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur-sm sm:left-[36%]">
                {"นครสวรรค์"}
              </div>
            </div>

            {/* Route stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              <div className="flex flex-col items-center gap-1.5 px-4 py-5">
                <Route className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="mt-1 text-sm font-bold">690 km</Badge>
                <span className="text-xs text-muted-foreground">{"ระยะทาง"}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 px-4 py-5">
                <Clock className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="mt-1 text-sm font-bold">{"~9 ชม."}</Badge>
                <span className="text-xs text-muted-foreground">{"เวลาขับรถ"}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 px-4 py-5">
                <Fuel className="h-5 w-5 text-accent" />
                <Badge variant="secondary" className="mt-1 text-sm font-bold">{"~2,500 THB"}</Badge>
                <span className="text-xs text-muted-foreground">{"ค่าน้ำมัน"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
