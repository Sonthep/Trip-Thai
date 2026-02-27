"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Loader2 } from "lucide-react"

type Place = {
  id: string
  name: string
  province: string
  category: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  onSelect?: (place: Place) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function PlaceAutocomplete({ value, onChange, onSelect, placeholder, inputClassName }: Props) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value (only when no onSelect handler — free-text mode)
  useEffect(() => {
    if (!onSelect) setQuery(value)
  }, [value, onSelect])

  // Debounced search
  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/tourist-places?q=${encodeURIComponent(q)}&limit=8`)
        const data = await res.json()
        setSuggestions(data.places ?? [])
        setOpen((data.places ?? []).length > 0)
        setActiveIndex(-1)
      } catch {
        setSuggestions([])
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }, 280)
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    onChange(v) // always propagate free text immediately
    search(v)
  }

  function selectPlace(place: Place) {
    if (onSelect) {
      onSelect(place)
      setQuery("") // clear input after selection in multi-add mode
    } else {
      const label = `${place.name}, ${place.province}`
      setQuery(label)
      onChange(label)
    }
    setSuggestions([])
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      selectPlace(suggestions[activeIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClassName}
        />
        {loading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-white/30" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/10 bg-slate-800 py-1 shadow-xl">
          {suggestions.map((place, i) => (
            <li
              key={place.id}
              onMouseDown={() => selectPlace(place)}
              className={`flex cursor-pointer items-start gap-2 px-3 py-2 text-sm transition-colors ${
                i === activeIndex ? "bg-orange-500/20 text-orange-300" : "text-white/80 hover:bg-white/8"
              }`}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
              <div className="min-w-0">
                <p className="truncate font-medium">{place.name}</p>
                <p className="truncate text-[11px] text-white/40">{place.province}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
