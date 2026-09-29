import type { LeaderboardRow } from "@/lib/types"

const TYRE_STYLES: Record<string, { ring: string; label: string }> = {
  S: { ring: "border-f1-red text-f1-red", label: "Soft" },
  M: { ring: "border-f1-gold text-f1-gold", label: "Medium" },
  H: { ring: "border-foreground text-foreground", label: "Hard" },
  I: { ring: "border-emerald-500 text-emerald-500", label: "Intermediate" },
  W: { ring: "border-sky-500 text-sky-500", label: "Wet" },
}

function TyreBadge({ tyre }: { tyre?: string }) {
  if (!tyre) return <span className="text-muted-foreground">—</span>
  const style = TYRE_STYLES[tyre] ?? { ring: "border-border text-muted-foreground", label: tyre }
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background font-mono text-xs font-bold ${style.ring}`}
      title={style.label}
    >
      {tyre}
    </span>
  )
}

export function LiveLeaderboard({ rows }: { rows: LeaderboardRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
        Waiting for live timing data…
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid grid-cols-[2.5rem_1fr_5rem_2.5rem] items-center gap-2 border-b border-border px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:grid-cols-[2.5rem_1fr_5.5rem_5.5rem_5rem_2.5rem]">
        <span>Pos</span>
        <span>Driver</span>
        <span className="hidden text-right sm:block">Last Lap</span>
        <span className="text-right">Gap</span>
        <span className="hidden text-right sm:block">Lap</span>
        <span className="text-center">Tyre</span>
      </div>

      <ul>
        {rows.map((row) => {
          const retired = row.gap === "OUT" || row.gap === "DNF"
          return (
            <li
              key={row.driverNumber}
              className="grid grid-cols-[2.5rem_1fr_5rem_2.5rem] items-center gap-2 border-b border-border/60 px-3 py-2.5 transition-colors last:border-b-0 hover:bg-foreground/[0.03] sm:grid-cols-[2.5rem_1fr_5.5rem_5.5rem_5rem_2.5rem]"
            >
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {String(row.position).padStart(2, "0")}
              </span>

              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: row.teamColor }} />
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${retired ? "text-muted-foreground" : "text-foreground"}`}>
                    <span className="font-mono text-xs text-muted-foreground">{row.code}</span> {row.name}
                  </p>
                  <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{row.teamName}</p>
                </div>
              </div>

              <span className="hidden text-right font-mono text-xs tabular-nums text-foreground/70 sm:block">
                {row.lastLap ?? "—"}
              </span>

              <span
                className={`text-right font-mono text-xs font-medium tabular-nums ${
                  retired ? "text-f1-red" : row.gap === "LEADER" ? "text-f1-gold" : "text-foreground/70"
                }`}
              >
                {row.gap ?? "—"}
              </span>

              <span className="hidden text-right font-mono text-xs tabular-nums text-muted-foreground sm:block">
                {row.lap ?? "—"}
              </span>

              <span className="flex justify-center">
                <TyreBadge tyre={row.tyre} />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
