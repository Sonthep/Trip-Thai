"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Copy, Share2 } from "lucide-react"

type Props = {
  url?: string
  title?: string
  description?: string
  tripSlug?: string
}

const LINE_ICON = (
  <svg viewBox="0 0 40 40" width="16" height="16" fill="currentColor">
    <path d="M20 2C10.06 2 2 8.92 2 17.4c0 7.64 6.77 14.03 15.92 15.2.62.13 1.46.41 1.67.93.19.48.13 1.22.06 1.7l-.27 1.62c-.08.48-.38 1.87 1.64 1.02s10.93-6.43 14.91-11.01C38.73 23.8 40 20.73 40 17.4 40 8.92 29.94 2 20 2zm-6.8 20.1H9.38a1 1 0 0 1-1-1V12.5a1 1 0 0 1 2 0v7.6h2.82a1 1 0 0 1 0 2zm3.6 0a1 1 0 0 1-2 0V12.5a1 1 0 0 1 2 0v9.6zm9.25 0a1 1 0 0 1-.65.94.98.98 0 0 1-1.1-.3l-4.5-6.13v5.49a1 1 0 0 1-2 0V12.5a1 1 0 0 1 .65-.94.98.98 0 0 1 1.1.3l4.5 6.13V12.5a1 1 0 0 1 2 0v9.6zm5.7 0h-3.82a1 1 0 0 1-1-1V12.5a1 1 0 0 1 2 0v7.6h2.82a1 1 0 0 1 0 2z" />
  </svg>
)

const FB_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const X_ICON = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function ShareButton({ url, title, description }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  function getUrl() {
    return url ?? (typeof window !== "undefined" ? window.location.href : "")
  }
  function getTitle() {
    return title ?? (typeof document !== "undefined" ? document.title : "TripThai")
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* */ }
    setOpen(false)
  }

  function shareToLine() {
    const u = encodeURIComponent(getUrl())
    const t = encodeURIComponent(getTitle())
    window.open(`https://social-plugins.line.me/lineit/share?url=${u}&text=${t}`, "_blank")
    setOpen(false)
  }

  function shareToFacebook() {
    const u = encodeURIComponent(getUrl())
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, "_blank", "width=600,height=400")
    setOpen(false)
  }

  function shareToX() {
    const u = encodeURIComponent(getUrl())
    const t = encodeURIComponent(`${getTitle()}${description ? ` — ${description}` : ""}`)
    window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`, "_blank", "width=600,height=400")
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        แชร์ให้เพื่อน
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl shadow-black/50">
          <div className="border-b border-white/10 px-4 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">แชร์ทริปนี้ไปยัง</p>
          </div>
          <button onClick={copyLink} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/8 hover:text-white">
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/50" />}
            <span>{copied ? "คัดลอกแล้ว!" : "คัดลอก Link"}</span>
          </button>
          <button onClick={shareToLine} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/8 hover:text-white">
            <span className="text-[#06c755]">{LINE_ICON}</span>
            <span>แชร์ใน Line</span>
          </button>
          <button onClick={shareToFacebook} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/8 hover:text-white">
            <span className="text-[#1877f2]">{FB_ICON}</span>
            <span>แชร์ใน Facebook</span>
          </button>
          <button onClick={shareToX} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/8 hover:text-white">
            <span className="text-white/70">{X_ICON}</span>
            <span>แชร์ใน X</span>
          </button>
        </div>
      )}
    </div>
  )
}
