"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"
import type { RaceNotification } from "@/lib/types"

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export function NotificationsBell({
  items,
  onClear,
  hasFavorites,
}: {
  items: RaceNotification[]
  onClear: () => void
  hasFavorites: boolean
}) {
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const unread = Math.max(0, items.length - seen)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("mousedown", onDown)
    return () => window.removeEventListener("mousedown", onDown)
  }, [open])

  const toggle = () => {
    setOpen((o) => {
      const next = !o
      if (next) setSeen(items.length)
      return next
    })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-f1-red px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl sm:w-80">
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notifications</span>
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs leading-relaxed text-muted-foreground">
                {hasFavorites
                  ? "No alerts yet. You'll be notified here when your favorite drivers and teams make a move during a live session."
                  : "Star a driver or team to get personalized live alerts here."}
              </p>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n.id} className="flex items-start gap-2.5 border-b border-border/60 px-3 py-2.5 last:border-b-0">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: n.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-popover-foreground">{n.message}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{timeAgo(n.ts)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
