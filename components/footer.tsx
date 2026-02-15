import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between lg:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-bold text-foreground">
            TripThai
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            {"เกี่ยวกับเรา"}
          </a>
          <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            {"ติดต่อ"}
          </a>
          <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            {"นโยบายความเป็นส่วนตัว"}
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          {"สร้างขึ้นเพื่อคนรักการเดินทางทั่วไทย"}
        </p>
      </div>
    </footer>
  )
}
