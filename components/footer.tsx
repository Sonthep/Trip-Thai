import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between lg:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-bold text-foreground">
            TripThai
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {"Built for road trip lovers exploring Thailand."}
        </p>
      </div>
    </footer>
  )
}
