"use client"

import { useState } from "react"
import type { DriverStanding } from "@/lib/types"
import { FavButton } from "@/components/fav-button"
import { Modal } from "@/components/modal"
import { DriverDetail } from "@/components/driver-detail"
import { Flag } from "@/components/flag"

export function DriverStandings({ standings }: { standings: DriverStanding[] }) {
  const [selected, setSelected] = useState<DriverStanding | null>(null)
  const leaderPoints = standings[0]?.points ?? 0

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <ul>
        {standings.map((driver, index) => (
          <li key={driver.id} className="flex items-center gap-2 border-b border-border/60 px-2 py-2.5 last:border-b-0">
            <button
              type="button"
              onClick={() => setSelected(driver)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="w-6 pl-1 font-mono text-sm font-bold tabular-nums text-muted-foreground">
                {driver.position}
              </span>
              <span className="h-7 w-1 shrink-0 rounded-full" style={{ backgroundColor: driver.teamColor }} />
              <span className="w-8 font-mono text-xs font-bold tabular-nums" style={{ color: driver.teamColor }}>
                {driver.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                  <Flag nationality={driver.nationality} />
                  {driver.name}
                </p>
                <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{driver.teamName}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold tabular-nums text-foreground">{driver.points}</span>
                {index > 0 && (
                  <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    -{leaderPoints - driver.points}
                  </p>
                )}
              </div>
            </button>
            <FavButton kind="driver" id={driver.code} />
          </li>
        ))}
      </ul>

      <Modal open={selected !== null} onClose={() => setSelected(null)} label="Driver details">
        {selected && <DriverDetail driver={selected} />}
      </Modal>
    </div>
  )
}
