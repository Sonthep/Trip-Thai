"use client"

import { useState, useRef, useEffect } from "react"
import { Map, Plus, Trash2, Pencil, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TripDay } from "@/lib/trips"

type Props = {
  initialItinerary: TripDay[]
}

function EditableText({
  value,
  onCommit,
  className,
  placeholder,
  multiline,
}: {
  value: string
  onCommit: (v: string) => void
  className?: string
  placeholder?: string
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value)
      setTimeout(() => ref.current?.select(), 0)
    }
  }, [editing, value])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed) onCommit(trimmed)
    setEditing(false)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    const sharedClass =
      "w-full rounded border border-emerald-400/50 bg-slate-800 px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 " +
      (className ?? "")
    return (
      <span className="flex items-center gap-1">
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            rows={2}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit() }
              if (e.key === "Escape") cancel()
            }}
            className={sharedClass + " resize-none text-xs"}
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit()
              if (e.key === "Escape") cancel()
            }}
            className={sharedClass + " text-sm font-semibold"}
          />
        )}
        <button onMouseDown={(e) => { e.preventDefault(); commit() }} className="shrink-0 rounded p-0.5 text-emerald-400 hover:bg-emerald-400/10">
          <Check className="h-3.5 w-3.5" />
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); cancel() }} className="shrink-0 rounded p-0.5 text-white/40 hover:bg-white/10">
          <X className="h-3.5 w-3.5" />
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group inline-flex items-start gap-1 rounded-md px-0.5 py-0.5 text-left transition hover:bg-white/5"
    >
      <span className={className}>{value}</span>
      <Pencil className="mt-0.5 h-2.5 w-2.5 shrink-0 opacity-0 transition group-hover:opacity-40" />
    </button>
  )
}

export function EditableItinerary({ initialItinerary }: Props) {
  const [days, setDays] = useState<TripDay[]>(initialItinerary)

  function updateTitle(dayIdx: number, title: string) {
    setDays((prev) => prev.map((d, i) => i === dayIdx ? { ...d, title } : d))
  }

  function updateItem(dayIdx: number, itemIdx: number, value: string) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, items: d.items.map((it, j) => (j === itemIdx ? value : it)) }
          : d
      )
    )
  }

  function deleteItem(dayIdx: number, itemIdx: number) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, items: d.items.filter((_, j) => j !== itemIdx) } : d
      )
    )
  }

  function addItem(dayIdx: number) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, items: [...d.items, "กิจกรรมใหม่"] } : d
      )
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          <Map className="h-4 w-4 text-emerald-400" />
          แผนเที่ยววันต่อวัน
        </h2>
        <p className="hidden text-[11px] text-white/55 sm:block">คลิกข้อความเพื่อแก้ไข · กด + เพิ่มกิจกรรม</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {days.map((day, dayIdx) => (
          <Card
            key={day.day}
            className="relative border-white/10 bg-slate-900/80 shadow-md shadow-black/20"
          >
            <div className="absolute left-4 top-4 flex h-7 items-center rounded-full bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/40">
              Day {day.day}
            </div>
            <CardHeader className="pb-2 pt-11">
              <CardTitle className="text-sm font-semibold text-white">
                <EditableText
                  value={day.title}
                  onCommit={(v) => updateTitle(dayIdx, v)}
                  className="text-sm font-semibold text-white"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-white/75">
              <ul className="space-y-2">
                {day.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="group flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <div className="flex flex-1 items-start gap-1">
                      <EditableText
                        value={item}
                        onCommit={(v) => updateItem(dayIdx, itemIdx, v)}
                        className="text-xs text-white/75"
                        multiline
                      />
                      <button
                        onClick={() => deleteItem(dayIdx, itemIdx)}
                        className="mt-0.5 shrink-0 rounded p-0.5 text-white/20 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => addItem(dayIdx)}
                className="mt-2 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-emerald-400/70 transition hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <Plus className="h-3 w-3" />
                เพิ่มกิจกรรม
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
