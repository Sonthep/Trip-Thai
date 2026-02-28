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
  "photo-1583417319070-4a69db38a482", // Bali temple (NOT Thai — must stay blacklisted)
])

// ── Curated map: place_id → confirmed English Wikipedia article ──────────────
// Direct title → image — bypasses unreliable search entirely for famous places
const CURATED_WIKI: Record<string, { title: string; lang: "en" | "th" }> = {
  // Bangkok
  "bkk-1":  { title: "Temple of the Emerald Buddha", lang: "en" },
  "bkk-2":  { title: "Wat Arun", lang: "en" },
  "bkk-3":  { title: "Wat Pho", lang: "en" },
  "bkk-4":  { title: "Yaowarat Road", lang: "en" },
  "bkk-5":  { title: "Chatuchak Weekend Market", lang: "en" },
  "bkk-6":  { title: "Khao San Road", lang: "en" },
  "bkk-7":  { title: "Jim Thompson House", lang: "en" },
  "bkk-8":  { title: "Benjakitti Park", lang: "en" },
  "bkk-9":  { title: "Lumphini Park", lang: "en" },
  "bkk-10": { title: "Wat Saket", lang: "en" },
  // Krabi
  "krabi-1": { title: "Railay Beach", lang: "en" },
  "krabi-2": { title: "Phi Phi Islands", lang: "en" },
  "krabi-3": { title: "Ao Nang", lang: "en" },
  "krabi-4": { title: "Tiger Cave Temple", lang: "en" },
  "krabi-5": { title: "Phra Nang Cave", lang: "en" },
  "krabi-6": { title: "Ko Poda", lang: "en" },
  "krabi-8": { title: "Ko Lanta", lang: "en" },
  // Kanchanaburi
  "kan-1": { title: "Bridge on the River Kwai", lang: "en" },
  "kan-3": { title: "Erawan National Park", lang: "en" },
  "kan-9": { title: "Three Pagodas Pass", lang: "en" },
  // Nakhon Ratchasima
  "nrat-1": { title: "Khao Yai National Park", lang: "en" },
  "nrat-2": { title: "Phimai historical park", lang: "en" },
  "nrat-3": { title: "Thao Suranari", lang: "en" },
  // Ayutthaya
  "ayut-1": { title: "Ayutthaya Historical Park", lang: "en" },
  "ayut-2": { title: "Wat Mahathat, Ayutthaya", lang: "en" },
  "ayut-4": { title: "Wat Phra Si Sanphet", lang: "en" },
  "ayut-6": { title: "Wat Chaiwatthanaram", lang: "en" },
  "ayut-8": { title: "Bang Pa-In Royal Palace", lang: "en" },
  // Chiang Mai
  "cmai-1": { title: "Doi Inthanon", lang: "en" },
  "cmai-2": { title: "Wat Phra That Doi Suthep", lang: "en" },
  "cmai-4": { title: "Tha Phae Gate", lang: "en" },
  "cmai-5": { title: "Mon Cham", lang: "en" },
  "cmai-6": { title: "Wat Chedi Luang", lang: "en" },
  // Chiang Rai
  "crai-1": { title: "Wat Rong Khun", lang: "en" },
  "crai-2": { title: "Baan Dam Museum", lang: "en" },
  "crai-4": { title: "Phu Chi Fah", lang: "en" },
  "crai-5": { title: "Golden Triangle", lang: "en" },
  "crai-6": { title: "Wat Phra That Doi Tung", lang: "en" },
  "crai-9": { title: "Wat Rong Suea Ten", lang: "en" },
  // Phuket
  "pket-1": { title: "Patong Beach", lang: "en" },
  "pket-2": { title: "Phuket Old Town", lang: "en" },
  "pket-3": { title: "Promthep Cape", lang: "en" },
  "pket-4": { title: "Karon Beach", lang: "en" },
  "pket-5": { title: "Big Buddha, Phuket", lang: "en" },
  "pket-8": { title: "Phi Phi Islands", lang: "en" },
  "pket-10":{ title: "Surin Beach", lang: "en" },
  // Surat Thani / Ko Samui
  "surat-1": { title: "Ko Samui", lang: "en" },
  "surat-2": { title: "Ko Tao, Surat Thani", lang: "en" },
  "surat-3": { title: "Ang Thong National Marine Park", lang: "en" },
  // Chonburi / Pattaya
  "chon-1": { title: "Pattaya", lang: "en" },
  "chon-2": { title: "Ko Lan", lang: "en" },
  "chon-3": { title: "Nong Nooch Tropical Garden", lang: "en" },
  "chon-5": { title: "Ko Si Chang", lang: "en" },
  // Prachuap / Hua Hin
  "pkha-1": { title: "Hua Hin", lang: "en" },
  "pkha-3": { title: "Khao Sam Roi Yot National Park", lang: "en" },
  // Sukhothai
  "suk-1": { title: "Sukhothai Historical Park", lang: "en" },
  "suk-2": { title: "Wat Si Chum", lang: "en" },
  // Nan
  "nan-1": { title: "Wat Phumin", lang: "en" },
}

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

async function fetchWikiImage(placeId: string, name: string): Promise<string | null> {
  const cacheKey = placeId || name
  if (wikiCache.has(cacheKey)) return wikiCache.get(cacheKey)!
  if (inFlight.has(cacheKey)) return inFlight.get(cacheKey)!

  const promise = (async () => {
    try {
      // 0. Curated map — direct English Wikipedia article (most accurate)
      if (placeId && CURATED_WIKI[placeId]) {
        const { title, lang } = CURATED_WIKI[placeId]
        const src = await fetchWikiImageByTitle(title, lang)
        if (src) { wikiCache.set(cacheKey, src); return src }
      }

      // 1. Thai Wikipedia — exact name
      let src = await fetchWikiImageByTitle(name, "th")
      if (src) { wikiCache.set(cacheKey, src); return src }

      // 2. Strip parenthetical — "วัดสระเกศ (ภูเขาทอง)" → "วัดสระเกศ"
      const stripped = name.replace(/\s*\(.*?\)\s*/g, "").trim()
      if (stripped && stripped !== name) {
        src = await fetchWikiImageByTitle(stripped, "th")
        if (src) { wikiCache.set(cacheKey, src); return src }
      }

      // 3. Thai Wikipedia search → canonical title
      const canonical = await searchWikiTitle(stripped || name, "th")
      if (canonical) {
        src = await fetchWikiImageByTitle(canonical, "th")
        if (src) { wikiCache.set(cacheKey, src); return src }
      }

      // 4. English Wikipedia search (much better image coverage for Thai tourist places)
      const enTitle = await searchWikiTitle(stripped || name, "en")
      if (enTitle) {
        src = await fetchWikiImageByTitle(enTitle, "en")
        if (src) { wikiCache.set(cacheKey, src); return src }
      }
    } catch {
      // network / timeout
    }
    wikiCache.set(cacheKey, null)
    return null
  })()

  inFlight.set(cacheKey, promise)
  const result = await promise
  inFlight.delete(cacheKey)
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
  // Wat Pho, Bangkok (via Wikimedia Commons — confirmed Thai temple)
  temple:    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Wat_Pho_temple_Bangkok.jpg/640px-Wat_Pho_temple_Bangkok.jpg",
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
  /** place.id from touristPlaces — used for curated Wikipedia lookup */
  placeId?: string
  name: string
  imageUrl?: string
  category: string
  className?: string
  /** Extra class applied to the fallback emoji div */
  fallbackClassName?: string
}

export function PlaceImage({ placeId = "", name, imageUrl, category, className = "", fallbackClassName = "" }: Props) {
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

    fetchWikiImage(placeId, name).then((url) => {
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
  }, [placeId, name, imageUrl, needsWiki, category])

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
