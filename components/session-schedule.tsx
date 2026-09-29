"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { RaceEvent } from "@/lib/types"
import { shortDate } from "@/lib/f1-utils"
import { useI18n } from "@/lib/i18n"
import { Flag } from "@/components/flag"
import { RaceDetail } from "@/components/race-detail"

const STATUS_STYLES: Record<RaceEvent["status"], string> = {
  LIVE: "border-f1-red/40 bg-f1-red/10 text-f1-red",
  FINISHED: "border-border bg-foreground/5 text-muted-foreground",
  UPCOMING: "border-f1-gold/30 bg-f1-gold/10 text-f1-gold",
}

export function SessionSchedule({ races }: { races: RaceEvent[] }) {
  const { t } = useI18n()
  const [selected, setSelected] = useState<RaceEvent | null>(null)
  const nextRound = races.find((r) => r.status === "UPCOMING")?.round

  const statusLabel = (status: RaceEvent["status"]) =>
    status === "LIVE" ? t("status.live") : status === "UPCOMING" ? t("status.upcoming") : t("status.finished")

  return (
    <>
      <ul className="space-y-2">
        {races.map((race) => {
          const isNext = race.round === nextRound
          return (
            <li key={race.round}>
              <button
                type="button"
                onClick={() => setSelected(race)}
                className={`flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-3 text-left transition-colors hover:border-f1-red/50 hover:bg-foreground/5 ${
                  isNext ? "border-f1-gold/40" : "border-border"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-xs font-bold text-muted-foreground">
                  {String(race.round).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                    <Flag country={race.country} className="h-3 w-4 rounded-[1px] object-cover" />
                    {race.raceName}
                  </p>
                  <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                    {race.locality}, {race.country} · {shortDate(race.date)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[race.status]}`}
                  >
                    {statusLabel(race.status)}
                  </span>
                  {race.status === "UPCOMING" && race.daysUntil != null && (
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      {race.daysUntil === 0 ? t("countdown.today") : t("countdown.inDays", { days: race.daysUntil })}
                    </span>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {selected && <RaceModal race={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function RaceModal({ race, onClose }: { race: RaceEvent; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-background p-4 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <RaceDetail race={race} />
      </div>
    </div>
  )
}
