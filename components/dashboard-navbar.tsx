"use client"

import { MapPin, BarChart3, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-foreground">
              TripThai
            </span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="sm" className="gap-1.5 text-foreground">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <MapPin className="h-4 w-4" />
              My Trips
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            TT
          </div>
        </div>
      </div>
    </header>
  )
}
