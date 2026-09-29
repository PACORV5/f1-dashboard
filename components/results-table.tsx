"use client"

import type { RaceResultRow } from "@/lib/types"
import { Flag } from "@/components/flag"
import { useI18n } from "@/lib/i18n"

export function ResultsTable({ rows }: { rows: RaceResultRow[] }) {
  const { t } = useI18n()

  if (rows.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
        {t("results.none")}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid grid-cols-[2.5rem_1fr_4rem_3rem] items-center gap-2 border-b border-border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2.5rem_1fr_6rem_4rem_3rem]">
        <span>{t("col.pos")}</span>
        <span>{t("col.driver")}</span>
        <span className="hidden text-right sm:block">{t("col.timeStatus")}</span>
        <span className="text-right">{t("col.grid")}</span>
        <span className="text-right">{t("col.pts")}</span>
      </div>

      <ul>
        {rows.map((row) => {
          const finished = /finished|\+\d+ lap/i.test(row.status)
          const timeOrStatus = row.time ?? (finished ? row.status : row.status)
          return (
            <li
              key={row.number}
              className="grid grid-cols-[2.5rem_1fr_4rem_3rem] items-center gap-2 border-b border-border/60 px-3 py-2.5 last:border-b-0 hover:bg-foreground/[0.03] sm:grid-cols-[2.5rem_1fr_6rem_4rem_3rem]"
            >
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {String(row.position).padStart(2, "0")}
              </span>

              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: row.teamColor }} />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                    <Flag nationality={row.nationality} />
                    <span className="font-mono text-xs text-muted-foreground">{row.code}</span> {row.driverName}
                  </p>
                  <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{row.teamName}</p>
                </div>
              </div>

              <span className="hidden text-right font-mono text-xs tabular-nums text-foreground/70 sm:block">
                {row.time
                  ? row.position === 1
                    ? row.time.replace(/^\+/, "")
                    : `+${row.time}`.replace("++", "+")
                  : row.status}
              </span>

              <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">{row.grid || "—"}</span>

              <span className="text-right font-mono text-sm font-bold tabular-nums text-foreground">{row.points}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
