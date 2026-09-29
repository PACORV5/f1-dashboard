"use client"

import { useState } from "react"
import type { RaceEvent } from "@/lib/types"
import { teamColor } from "@/lib/f1-api"
import { useRaceDetail } from "@/lib/f1-hooks"
import { shortDate } from "@/lib/f1-utils"
import { useI18n } from "@/lib/i18n"
import { Flag } from "@/components/flag"

type SubTab = "results" | "qualifying" | "circuit"

export function RaceDetail({ race }: { race: RaceEvent }) {
  const { t } = useI18n()
  const { data, isLoading } = useRaceDetail(race.round)
  const [sub, setSub] = useState<SubTab>(race.status === "UPCOMING" ? "circuit" : "results")

  const tabs: { id: SubTab; label: string }[] = [
    { id: "results", label: t("race.results") },
    { id: "qualifying", label: t("race.qualifying") },
    { id: "circuit", label: t("race.circuit") },
  ]

  return (
    <div className="space-y-4">
      <header className="border-l-2 border-f1-red pl-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted-foreground">
            R{String(race.round).padStart(2, "0")}
          </span>
          <Flag country={race.country} className="h-3.5 w-5 rounded-[1px] object-cover" />
        </div>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground text-balance">{race.raceName}</h2>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {race.circuitName} · {race.locality}, {race.country} · {shortDate(race.date)}
        </p>
      </header>

      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setSub(tb.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              sub === tb.id ? "bg-f1-red text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {sub === "circuit" ? (
        <CircuitView race={race} />
      ) : isLoading ? (
        <LoadingRows />
      ) : sub === "results" ? (
        <ResultsView race={race} rows={data?.results ?? []} />
      ) : (
        <QualifyingView rows={data?.qualifying ?? []} />
      )}
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-11 animate-pulse rounded-lg bg-foreground/5" />
      ))}
    </div>
  )
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-card px-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function ResultsView({ race, rows }: { race: RaceEvent; rows: { position: number; code: string; driverName: string; nationality?: string; teamId: string; teamName: string; grid: number; status: string; time?: string; points: number; number: string }[] }) {
  const { t } = useI18n()
  if (rows.length === 0) {
    return <EmptyNote text={race.status === "UPCOMING" ? t("race.upcomingNote") : t("race.noResults")} />
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid grid-cols-[2.25rem_1fr_5rem_2.5rem] items-center gap-2 border-b border-border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span>{t("col.pos")}</span>
        <span>{t("col.driver")}</span>
        <span className="text-right">{t("col.timeStatus")}</span>
        <span className="text-right">{t("col.pts")}</span>
      </div>
      <ul>
        {rows.map((row) => (
          <li
            key={row.number || row.code}
            className="grid grid-cols-[2.25rem_1fr_5rem_2.5rem] items-center gap-2 border-b border-border/60 px-3 py-2.5 last:border-b-0"
          >
            <span className="font-mono text-sm font-bold tabular-nums text-foreground">
              {String(row.position).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: teamColor(row.teamId) }} />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                  <Flag nationality={row.nationality} />
                  <span className="font-mono text-xs text-muted-foreground">{row.code}</span> {row.driverName}
                </p>
                <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{row.teamName}</p>
              </div>
            </div>
            <span className="text-right font-mono text-xs tabular-nums text-foreground/70">
              {row.time ? row.time : row.status}
            </span>
            <span className="text-right font-mono text-sm font-bold tabular-nums text-foreground">{row.points}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QualifyingView({ rows }: { rows: { position: number; code: string; driverName: string; nationality?: string; teamId: string; teamName: string; q1?: string; q2?: string; q3?: string }[] }) {
  const { t } = useI18n()
  if (rows.length === 0) return <EmptyNote text={t("race.noQualifying")} />
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid grid-cols-[2.25rem_1fr_3.5rem_3.5rem_3.5rem] items-center gap-1.5 border-b border-border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span>{t("col.pos")}</span>
        <span>{t("col.driver")}</span>
        <span className="text-right">{t("col.q1")}</span>
        <span className="text-right">{t("col.q2")}</span>
        <span className="text-right">{t("col.q3")}</span>
      </div>
      <ul>
        {rows.map((row) => (
          <li
            key={row.code}
            className="grid grid-cols-[2.25rem_1fr_3.5rem_3.5rem_3.5rem] items-center gap-1.5 border-b border-border/60 px-3 py-2.5 last:border-b-0"
          >
            <span className="font-mono text-sm font-bold tabular-nums text-foreground">
              {String(row.position).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-5 w-1 shrink-0 rounded-full" style={{ backgroundColor: teamColor(row.teamId) }} />
              <Flag nationality={row.nationality} />
              <span className="truncate text-sm font-semibold text-foreground">
                <span className="font-mono text-xs text-muted-foreground">{row.code}</span>
              </span>
            </div>
            <span className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">{row.q1 || "—"}</span>
            <span className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">{row.q2 || "—"}</span>
            <span className="text-right font-mono text-[11px] tabular-nums text-foreground">{row.q3 || "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CircuitView({ race }: { race: RaceEvent }) {
  const { t } = useI18n()
  const lat = Number(race.lat)
  const lon = Number(race.long)
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon) && (lat !== 0 || lon !== 0)

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-bold text-foreground">{race.circuitName}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
          <Flag country={race.country} />
          {race.locality}, {race.country}
        </p>
      </div>

      {hasCoords ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <iframe
            title={race.circuitName}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.03}%2C${lat - 0.02}%2C${lon + 0.03}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lon}`}
          />
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-border bg-card px-3 py-2 text-center text-xs font-semibold text-f1-red hover:underline"
          >
            {t("race.viewMap")}
          </a>
        </div>
      ) : (
        <EmptyNote text={race.circuitName} />
      )}
    </div>
  )
}
