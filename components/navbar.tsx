"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Bookmark, ChevronDown, LogOut, MapPin, Menu, X } from "lucide-react"

const REGION_ITEMS = [
  { slug: "north", name: "ภาคเหนือ", desc: "เชียงใหม่ · เชียงราย · ปาย", emoji: "🏔️", count: "12+ เส้นทาง", bg: "from-amber-400" },
  { slug: "south", name: "ภาคใต้", desc: "ภูเก็ต · กระบี่ · สมุย", emoji: "🏖️", count: "9+ เส้นทาง", bg: "from-sky-400" },
  { slug: "central", name: "ภาคกลาง", desc: "อยุธยา · เขาใหญ่ · กาญจนบุรี", emoji: "🏛️", count: "18+ เส้นทาง", bg: "from-emerald-400" },
  { slug: "northeast", name: "ภาคอีสาน", desc: "โคราช · อุดร · ขอนแก่น", emoji: "🌾", count: "8+ เส้นทาง", bg: "from-orange-400" },
]

const POPULAR_TRIPS = [
  { name: "กรุงเทพ → เชียงใหม่", slug: "bangkok-chiang-mai", meta: "700 กม. · 3 วัน" },
  { name: "กรุงเทพ → ภูเก็ต", slug: "bangkok-phuket", meta: "850 กม. · 4 วัน" },
  { name: "กรุงเทพ → เขาใหญ่", slug: "bangkok-khao-yai", meta: "200 กม. · 2 วัน" },
  { name: "กรุงเทพ → หัวหิน", slug: "bangkok-hua-hin", meta: "195 กม. · 3 วัน" },
  { name: "กรุงเทพ → กาญจนบุรี", slug: "bangkok-kanchanaburi", meta: "130 กม. · 2 วัน" },
  { name: "กรุงเทพ → อยุธยา", slug: "bangkok-ayutthaya", meta: "85 กม. · 1 วัน" },
]

export function Navbar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [tripsOpen, setTripsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const exploreRef = useRef<HTMLDivElement>(null)
  const tripsRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const loginRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false)
      if (tripsRef.current && !tripsRef.current.contains(e.target as Node)) setTripsOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) setLoginOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">TripThai</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">

          {/* Explore mega-menu */}
          <div ref={exploreRef} className="relative">
            <button
              type="button"
              onClick={() => { setExploreOpen((v) => !v); setTripsOpen(false) }}
              className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                exploreOpen ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              สำรวจ
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`} />
            </button>

            {exploreOpen && (
              <div className="absolute left-0 top-full mt-2 w-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/40">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">🗺️ สำรวจตามภาค</p>
                  <Link href="/#explore" onClick={() => setExploreOpen(false)} className="text-xs font-semibold text-orange-500 hover:text-orange-600">
                    ดูแผนที่ทั้งหมด →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {REGION_ITEMS.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/region/${r.slug}`}
                      onClick={() => setExploreOpen(false)}
                      className="group flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-orange-100 hover:bg-orange-50"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${r.bg} to-slate-50 text-lg`}>
                        {r.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-orange-600">{r.name}</p>
                        <p className="text-[11px] text-slate-400">{r.desc}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-orange-500">{r.count}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/#quick-planner" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
            วางแผนทริป
          </Link>

          {/* Trips dropdown */}
          <div ref={tripsRef} className="relative">
            <button
              type="button"
              onClick={() => { setTripsOpen((v) => !v); setExploreOpen(false) }}
              className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                tripsOpen ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              เส้นทาง
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${tripsOpen ? "rotate-180" : ""}`} />
            </button>

            {tripsOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-300/40">
                <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">เส้นทางยอดนิยม</p>
                {POPULAR_TRIPS.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/trip/${t.slug}`}
                    onClick={() => setTripsOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-800">{t.name}</span>
                    <span className="text-[11px] text-slate-400">{t.meta}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/#how-it-works" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
            วิธีใช้
          </Link>

          <Link href="/buddy" className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
            หาเพื่อนทริป
          </Link>

          <Link href="/#quick-planner" className="ml-3">
            <Button size="sm" className="bg-orange-500 px-5 text-sm font-semibold hover:bg-orange-600">
              วางแผนทริปเลย →
            </Button>
          </Link>

          {/* Auth section */}
          <div className="ml-2">
            {session?.user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-orange-400 transition-opacity hover:opacity-80"
                  aria-label="โปรไฟล์"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt={session.user.name ?? ""} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-orange-500">
                      {session.user.name?.charAt(0) ?? "U"}
                    </span>
                  )}
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-300/40">
                    <div className="border-b border-slate-100 px-4 py-2.5">
                      <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{session.user.email ?? "Social Account"}</p>
                    </div>
                    <Link href="/my-trips" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <Bookmark className="h-4 w-4 text-orange-500" /> ทริปที่บันทึก
                    </Link>
                    <button onClick={() => signOut()}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <LogOut className="h-4 w-4 text-slate-400" /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div ref={loginRef} className="relative">
                <button
                  onClick={() => setLoginOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                  เข้าสู่ระบบ
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${loginOpen ? "rotate-180" : ""}`} />
                </button>
                {loginOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-300/40">
                    <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">เลือกเข้าสู่ระบบด้วย</p>
                    <button
                      onClick={() => { setLoginOpen(false); signIn("line") }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg viewBox="0 0 40 40" width="18" height="18" fill="#06c755">
                        <path d="M20 2C10.06 2 2 8.92 2 17.4c0 7.64 6.77 14.03 15.92 15.2.62.13 1.46.41 1.67.93.19.48.13 1.22.06 1.7l-.27 1.62c-.08.48-.38 1.87 1.64 1.02s10.93-6.43 14.91-11.01C38.73 23.8 40 20.73 40 17.4 40 8.92 29.94 2 20 2zm-6.8 20.1H9.38a1 1 0 0 1-1-1V12.5a1 1 0 0 1 2 0v7.6h2.82a1 1 0 0 1 0 2zm3.6 0a1 1 0 0 1-2 0V12.5a1 1 0 0 1 2 0v9.6zm9.25 0a1 1 0 0 1-.65.94.98.98 0 0 1-1.1-.3l-4.5-6.13v5.49a1 1 0 0 1-2 0V12.5a1 1 0 0 1 .65-.94.98.98 0 0 1 1.1.3l4.5 6.13V12.5a1 1 0 0 1 2 0v9.6zm5.7 0h-3.82a1 1 0 0 1-1-1V12.5a1 1 0 0 1 2 0v7.6h2.82a1 1 0 0 1 0 2z" />
                      </svg>
                      <span className="font-medium">LINE</span>
                    </button>
                    <button
                      onClick={() => { setLoginOpen(false); signIn("google") }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium">Google</span>
                    </button>
                    <button
                      onClick={() => { setLoginOpen(false); signIn("facebook") }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877f2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="font-medium">Facebook</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex items-center justify-center rounded-lg p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
        >
          {mobileOpen ? <X className="h-5 w-5 text-slate-900" /> : <Menu className="h-5 w-5 text-slate-900" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {REGION_ITEMS.map((r) => (
              <Link key={r.slug} href={`/region/${r.slug}`} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <span>{r.emoji}</span>{r.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-slate-100" />
            {POPULAR_TRIPS.slice(0, 4).map((t) => (
              <Link key={t.slug} href={`/trip/${t.slug}`} onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {t.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-slate-100" />
            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              วิธีใช้
            </Link>
            <Link href="/buddy" onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              หาเพื่อนทริป
            </Link>
            {session?.user && (
              <Link href="/my-trips" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Bookmark className="h-4 w-4 text-orange-500" /> ทริปที่บันทึก
              </Link>
            )}
          </nav>
          <Link href="/#quick-planner" onClick={() => setMobileOpen(false)} className="mt-4 block">
            <Button className="w-full bg-orange-500 font-semibold hover:bg-orange-600">วางแผนทริปเลย →</Button>
          </Link>
          {!session?.user && (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">เข้าสู่ระบบด้วย</p>
              <button
                onClick={() => { setMobileOpen(false); signIn("line") }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#06c755]/40 bg-[#06c755]/10 py-2.5 text-sm font-semibold text-[#06c755]"
              >
                <svg viewBox="0 0 40 40" width="18" height="18" fill="#06c755">
                  <path d="M20 2C10.06 2 2 8.92 2 17.4c0 7.64 6.77 14.03 15.92 15.2.62.13 1.46.41 1.67.93.19.48.13 1.22.06 1.7l-.27 1.62c-.08.48-.38 1.87 1.64 1.02s10.93-6.43 14.91-11.01C38.73 23.8 40 20.73 40 17.4 40 8.92 29.94 2 20 2zm-6.8 20.1H9.38a1 1 0 0 1-1-1V12.5a1 1 0 0 1 2 0v7.6h2.82a1 1 0 0 1 0 2zm3.6 0a1 1 0 0 1-2 0V12.5a1 1 0 0 1 2 0v9.6zm9.25 0a1 1 0 0 1-.65.94.98.98 0 0 1-1.1-.3l-4.5-6.13v5.49a1 1 0 0 1-2 0V12.5a1 1 0 0 1 .65-.94.98.98 0 0 1 1.1.3l4.5 6.13V12.5a1 1 0 0 1 2 0v9.6zm5.7 0h-3.82a1 1 0 0 1-1-1V12.5a1 1 0 0 1 2 0v7.6h2.82a1 1 0 0 1 0 2z" />
                </svg>
                LINE
              </button>
              <button
                onClick={() => { setMobileOpen(false); signIn("google") }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => { setMobileOpen(false); signIn("facebook") }}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#1877f2]/30 bg-[#1877f2]/8 py-2.5 text-sm font-semibold text-[#1877f2]"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          )}
          {session?.user && (
            <button
              onClick={() => { setMobileOpen(false); signOut() }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm text-slate-500"
            >
              <LogOut className="h-4 w-4" /> ออกจากระบบ ({session.user.name})
            </button>
          )}
        </div>
      )}
    </header>
  )
}
