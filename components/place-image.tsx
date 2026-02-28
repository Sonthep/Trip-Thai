"use client"

import { useState, useEffect, useRef } from "react"

// IDs confirmed recycled 15+ times across unrelated places in touristPlaces.ts
const GENERIC_UNSPLASH_IDS = new Set([
  "photo-1555939594-58d7cb561ad1", // 73× food/generic
  "photo-1528360983277-13d401cdc186", // 59× generic temple
  "photo-1508009603885-50cf7c8dd0d5", // 48× street/generic
  "photo-1501854140801-50d01698950b", // 48× nature/generic
  "photo-1559592413-7cec059d1b73",    // 43× generic
  "photo-1563492065599-3520f775eeed", // 39× Ayutthaya recycled
  "photo-1625244724120-1fd1d34d00f6", // 37× generic
  "photo-1448375240586-b89a72f82c95", // 35× generic
  "photo-1563158157-47f5c4fdb63b",    // 33× generic
  "photo-1563238953-a33614c5b748",    // 31× generic
  "photo-1513407030348-c983a97b98d8", // 31× culture/generic
  "photo-1531761535209-180857e963b9", // 30× generic
  "photo-1506905925346-21bda4d32df4", // 30× nature/generic
  "photo-1499678329028-101435549a4e", // 30× generic
  "photo-1596425163351-0a4f2a2ebf56", // 29× generic
  "photo-1512100356356-de5a42640c87", // 29× generic
  "photo-1534351590666-13aa2b43d436", // 24× generic
  "photo-1464822759023-fed622ff2c3b", // 23× generic
  "photo-1580870069867-74c57ee1bb07", // 21× generic
  "photo-1536514498073-12dbe93aeea6", // nature/generic
  "photo-1519451241324-20b4ea2c4220", // beach/generic (krabi recycled)
  "photo-1471922694854-ff1b63b20054", // culture/generic
  "photo-1596425163351-0a4f2a2ebf56", // generic
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

async function fetchWikiImageByTitle(title: string, lang = "th"): Promise<string | null> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages&pithumbsize=600&format=json&origin=*`
  const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
  if (!res.ok) return null
  const data = await res.json()
  const pages: Record<string, { thumbnail?: { source: string } }> = data?.query?.pages ?? {}
  for (const page of Object.values(pages)) {
    if (page.thumbnail?.source) return page.thumbnail.source
  }
  return null
}

async function searchWikiTitle(query: string, lang = "th"): Promise<string | null> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&list=search` +
    `&srsearch=${encodeURIComponent(query)}&srlimit=1&srprop=&format=json&origin=*`
  const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
  if (!res.ok) return null
  const data = await res.json()
  return (data?.query?.search?.[0]?.title as string | undefined) ?? null
}

async function fetchWikiImage(name: string): Promise<string | null> {
  if (wikiCache.has(name)) return wikiCache.get(name)!
  if (inFlight.has(name)) return inFlight.get(name)!

  const promise = (async () => {
    try {
      // 1. Thai Wikipedia — exact name
      let src = await fetchWikiImageByTitle(name, "th")
      if (src) { wikiCache.set(name, src); return src }

      // 2. Strip parenthetical — "วัดสระเกศ (ภูเขาทอง)" → "วัดสระเกศ"
      const stripped = name.replace(/\s*\(.*?\)\s*/g, "").trim()
      if (stripped && stripped !== name) {
        src = await fetchWikiImageByTitle(stripped, "th")
        if (src) { wikiCache.set(name, src); return src }
      }

      // 3. Thai Wikipedia search → canonical title
      const canonical = await searchWikiTitle(stripped || name, "th")
      if (canonical) {
        src = await fetchWikiImageByTitle(canonical, "th")
        if (src) { wikiCache.set(name, src); return src }
      }

      // 4. English Wikipedia search (much better image coverage for Thai tourist places)
      const enTitle = await searchWikiTitle(stripped || name, "en")
      if (enTitle) {
        src = await fetchWikiImageByTitle(enTitle, "en")
        if (src) { wikiCache.set(name, src); return src }
      }
    } catch {
      // network / timeout
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

// Category fallback — confirmed Thailand-specific photos
const CATEGORY_FALLBACK: Record<string, string> = {
  // Wat Arun, Bangkok (photo-1583417319070 is now NOT blacklisted)
  temple:    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80",
  // Erawan waterfall / Thai forest
  nature:    "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&q=80",
  // Thai street food / pad thai
  food:      "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
  // Ko Phi Phi beach
  beach:     "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80",
  // Thai cultural scene / Chiang Mai
  culture:   "https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600&q=80",
  // Doi Inthanon / Thai mountain viewpoint
  viewpoint: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80",
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
        setSrc(imageUrl)
        setStatus("ok")
      } else {
        // Final fallback: category-specific photo
        const fallback = CATEGORY_FALLBACK[category]
        if (fallback) {
          setSrc(fallback)
          setStatus("ok")
        } else {
          setStatus("error")
        }
      }
    })
  }, [name, imageUrl, needsWiki, category])

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
