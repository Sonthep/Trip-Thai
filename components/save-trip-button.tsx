"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Bookmark } from "lucide-react"

type Props = {
  type: "curated" | "custom"
  slug?: string
  title: string
  origin?: string
  destination?: string
  people?: number
  kmPerLiter?: number
  places?: string
  imageUrl?: string
}

export function SaveTripButton(props: Props) {
  const { data: session, status } = useSession()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if already saved on mount
  useEffect(() => {
    if (!session?.user) return
    async function check() {
      const res = await fetch("/api/save-trip/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      })
      if (res.ok) {
        const data = await res.json()
        setSaved(data.saved)
      }
    }
    check()
  }, [session, props.slug, props.origin, props.destination]) // eslint-disable-line react-hooks/exhaustive-deps

  async function toggle() {
    if (status === "unauthenticated") {
      signIn("line")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/save-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      })
      if (res.ok) {
        const data = await res.json()
        setSaved(data.saved)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "ยกเลิกบันทึก" : "บันทึกทริปนี้"}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        saved
          ? "border-amber-400/60 bg-amber-400/15 text-amber-300 hover:bg-amber-400/25"
          : "border-white/30 bg-transparent text-white hover:bg-white/10"
      }`}
    >
      <Bookmark className={`h-4 w-4 transition-all ${saved ? "fill-amber-400 text-amber-400" : ""}`} />
      {saved ? "บันทึกแล้ว" : "บันทึกทริป"}
    </button>
  )
}
