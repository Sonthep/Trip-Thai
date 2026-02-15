"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            TripThai
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </a>
          <Button size="sm">Start Planning</Button>
        </nav>

        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <Button size="sm" className="w-full">
              Start Planning
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
