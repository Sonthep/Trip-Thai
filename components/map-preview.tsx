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

        <Card className="mt-14 overflow-hidden border-border/60 shadow-xl">
          <CardContent className="p-0">
            {/* Map illustration */}
            <div className="relative h-80 overflow-hidden bg-[hsl(170,25%,94%)] sm:h-[420px]">
              {/* Topographic-style background pattern */}
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <pattern id="map-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(170,15%,85%)" strokeWidth="0.5" />
                  </pattern>
                  {/* Subtle topo rings */}
                  <radialGradient id="topo1" cx="35%" cy="40%" r="25%">
                    <stop offset="0%" stopColor="hsl(170,30%,88%)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <radialGradient id="topo2" cx="55%" cy="25%" r="20%">
                    <stop offset="0%" stopColor="hsl(170,25%,86%)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
                <rect width="100%" height="100%" fill="url(#topo1)" />
                <rect width="100%" height="100%" fill="url(#topo2)" />

                {/* Styled route line */}
                <path
                  d="M 200 320 C 220 270 260 250 280 220 S 320 170 340 150 S 380 110 400 85 S 440 55 470 40"
                  fill="none"
                  stroke="hsl(170,65%,36%)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="0"
                  opacity="0.25"
                />
                <path
                  d="M 200 320 C 220 270 260 250 280 220 S 320 170 340 150 S 380 110 400 85 S 440 55 470 40"
                  fill="none"
                  stroke="hsl(170,65%,36%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                />

                {/* Origin marker */}
                <circle cx="200" cy="320" r="10" fill="hsl(24,90%,55%)" />
                <circle cx="200" cy="320" r="5" fill="white" />

                {/* Intermediate stops */}
                <circle cx="310" cy="185" r="6" fill="hsl(170,65%,36%)" opacity="0.4" />
                <circle cx="310" cy="185" r="3" fill="white" />

                {/* Destination marker with animated pulse */}
                <circle cx="470" cy="40" r="18" fill="hsl(170,65%,36%)" opacity="0.15">
                  <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="470" cy="40" r="10" fill="hsl(170,65%,36%)" />
                <circle cx="470" cy="40" r="5" fill="white" />
              </svg>

              {/* City labels */}
              <div className="absolute bottom-10 left-[12%] flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-xs font-bold text-card-foreground shadow-lg sm:left-[16%]">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                {"กรุงเทพ"}
              </div>
              <div className="absolute right-[20%] top-4 flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-xs font-bold text-card-foreground shadow-lg sm:right-[28%] sm:top-4">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {"เชียงใหม่"}
              </div>
              <div className="absolute left-[30%] top-[42%] rounded-full bg-card/80 px-2.5 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur-sm sm:left-[28%]">
                {"นครสวรรค์"}
              </div>

              {/* Floating metric badges */}
              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2.5 sm:right-8">
                <div className="flex items-center gap-2 rounded-xl bg-card/95 px-3 py-2 shadow-md backdrop-blur-sm">
                  <Route className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-card-foreground">690 km</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-card/95 px-3 py-2 shadow-md backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-card-foreground">{"~9 ชม."}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-card/95 px-3 py-2 shadow-md backdrop-blur-sm">
                  <Fuel className="h-4 w-4 text-accent" />
                  <span className="text-sm font-bold text-card-foreground">{"~2,500 ฿"}</span>
                </div>
              </div>
            </div>

            {/* Bottom stats bar */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-card">
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
                <Badge variant="secondary" className="mt-1 text-sm font-bold">{"~2,500 ฿"}</Badge>
                <span className="text-xs text-muted-foreground">{"ค่าน้ำมัน"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
