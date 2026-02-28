"use client"

import { useState, useEffect, useRef } from "react"

// Generic Unsplash photo IDs that are recycled across many places — treat as "no real image"
const GENERIC_UNSPLASH_IDS = new Set([
  "photo-1508009603885-50cf7c8dd0d5",
  "photo-1563492065599-3520f775eeed",
  "photo-1580870069867-74c57ee1bb07",
  "photo-1528360983277-13d401cdc186",
  "photo-1506905925346-21bda4d32df4",
  "photo-1563158157-47f5c4fdb63b",
  "photo-1536514498073-12dbe93aeea6",
  "photo-1559592413-7cec059d1b73",
  "photo-1583417319070-4a69db38a482",
  "photo-1555939594-58d7cb561ad1",
  "photo-1471922694854-ff1b63b20054",
  "photo-1513407030348-c983a97b98d8",
  "photo-1596425163351-0a4f2a2ebf56",
])

// Module-level cache so we don't re-fetch on every render
const wikiCache = new Map<string, string | null>()
const inFlight = new Map<string, Promise<string | null>>()

function isGenericUrl(url: string | undefined): boolean {
  if (!url) return true
  for (const id of GENERIC_UNSPLASH_IDS) {
    if (url.includes(id)) return true
  }
  return false
}

async function fetchWikiImage(name: string): Promise<string | null> {
  if (wikiCache.has(name)) return wikiCache.get(name)!

  // Deduplicate concurrent requests for the same name
  if (inFlight.has(name)) return inFlight.get(name)!

  const promise = (async () => {
    try {
      // Try Thai Wikipedia first
      const res = await fetch(
        `https://th.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
        { signal: AbortSignal.timeout(4000) },
      )
      if (res.ok) {
        const data = await res.json()
        const src: string | undefined = data?.thumbnail?.source ?? data?.originalimage?.source
        if (src) {
          // Upscale Wikimedia thumbnails to 600px wide
          const bigger = src.replace(/\/\d+px-/, "/600px-")
          wikiCache.set(name, bigger)
          return bigger
        }
      }
    } catch {
      // network error / timeout — fall through
    }
    wikiCache.set(name, null)
    return null
  })()

  inFlight.set(name, promise)
  const result = await promise
  inFlight.delete(name)
  return result
}

const CATEGORY_EMOJI: Record<string, string> = {
  nature: "🌿",
  temple: "🛕",
  culture: "🎭",
  food: "🍜",
  beach: "🏖️",
  viewpoint: "🌅",
}

type Props = {
  name: string
  imageUrl?: string
  category: string
  className?: string
  /** Extra class applied to the fallback emoji div */
  fallbackClassName?: string
}

export function PlaceImage({ name, imageUrl, category, className = "", fallbackClassName = "" }: Props) {
  const needsWiki = isGenericUrl(imageUrl)
  const [src, setSrc] = useState<string | null>(needsWiki ? null : (imageUrl ?? null))
  const [status, setStatus] = useState<"loading" | "ok" | "error">(
    needsWiki ? "loading" : imageUrl ? "ok" : "error",
  )
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (!needsWiki) {
      setSrc(imageUrl ?? null)
      setStatus(imageUrl ? "ok" : "error")
      return
    }

    setStatus("loading")
    setSrc(null)

    fetchWikiImage(name).then((url) => {
      if (!mounted.current) return
      if (url) {
        setSrc(url)
        setStatus("ok")
      } else if (imageUrl && !isGenericUrl(imageUrl)) {
        // Fallback to original imageUrl if wiki fails but original isn't generic
        setSrc(imageUrl)
        setStatus("ok")
      } else {
        setStatus("error")
      }
    })
  }, [name, imageUrl, needsWiki])

  if (status === "loading") {
    return (
      <div className={`animate-pulse bg-slate-200 ${className}`}>
        <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-100" />
      </div>
    )
  }

  if (status === "ok" && src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
        onError={() => setStatus("error")}
      />
    )
  }

  // Fallback: emoji placeholder
  return (
    <div className={`flex items-center justify-center bg-slate-100 text-3xl ${fallbackClassName || className}`}>
      {CATEGORY_EMOJI[category] ?? "📍"}
    </div>
  )
}
