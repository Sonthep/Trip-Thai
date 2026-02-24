"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type Lead = {
  id: string
  name: string
  phone: string | null
  email: string | null
  tripSlug: string
  tripName: string
  createdAt: string
}

export default function AdminLeadsPage() {
  const [secret, setSecret] = useState("")
  const [showSecret, setShowSecret] = useState(false)
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchLeads(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/leads?secret=${encodeURIComponent(secret)}`)
      if (res.status === 401) {
        setError("รหัสผ่านไม่ถูกต้อง")
        setLeads(null)
        return
      }
      if (!res.ok) throw new Error("Server error")
      const data: Lead[] = await res.json()
      setLeads(data)
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    } finally {
      setLoading(false)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold">Admin — Leads</h1>
        <p className="mb-8 text-sm text-white/50">ผู้ที่กรอกข้อมูลขอรับแผนทริป</p>

        {/* Auth form */}
        {leads === null && (
          <form onSubmit={fetchLeads} className="mb-8 flex max-w-sm flex-col gap-3">
            <label className="text-sm text-white/70">Admin Secret</label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="กรอก ADMIN_SECRET"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="absolute right-3 top-3 text-white/40 hover:text-white/70"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              เข้าสู่ระบบ
            </button>
          </form>
        )}

        {/* Leads table */}
        {leads !== null && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-white/60">
                ทั้งหมด <span className="font-semibold text-white">{leads.length}</span> leads
              </p>
              <button
                onClick={() => { setLeads(null); setSecret("") }}
                className="text-xs text-white/40 underline hover:text-white/70"
              >
                ออกจากระบบ
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-sm text-white/50">ยังไม่มี lead</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      <th className="px-4 py-3">ชื่อ</th>
                      <th className="px-4 py-3">เบอร์โทร</th>
                      <th className="px-4 py-3">อีเมล</th>
                      <th className="px-4 py-3">ทริป</th>
                      <th className="px-4 py-3 whitespace-nowrap">วันที่</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="transition-colors hover:bg-white/5">
                        <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                        <td className="px-4 py-3 text-white/70">{lead.phone ?? "—"}</td>
                        <td className="px-4 py-3 text-white/70">{lead.email ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] text-emerald-300 ring-1 ring-emerald-500/30">
                            {lead.tripName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-white/50 whitespace-nowrap">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
