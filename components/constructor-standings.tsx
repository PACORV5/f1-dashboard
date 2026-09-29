"use client"

import { useState } from "react"
import type { Constructor, DriverStanding } from "@/lib/types"
import { FavButton } from "@/components/fav-button"
import { Modal } from "@/components/modal"
import { TeamDetail } from "@/components/team-detail"

export function ConstructorStandings({
  standings,
  drivers,
}: {
  standings: Constructor[]
  drivers: DriverStanding[]
}) {
  const [selected, setSelected] = useState<Constructor | null>(null)
  const maxPoints = standings[0]?.points ?? 1

  return (
    <div className="space-y-2">
      {standings.map((team) => (
        <div key={team.id} className="rounded-lg border border-border bg-card px-2 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected(team)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="w-5 pl-1 font-mono text-sm font-bold tabular-nums text-muted-foreground">
                {team.position}
              </span>
              <span className="h-7 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />
              <span className="flex-1 truncate text-sm font-semibold text-foreground">{team.name}</span>
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">{team.points}</span>
            </button>
            <FavButton kind="team" id={team.id} />
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(team.points / maxPoints) * 100}%`, backgroundColor: team.color }}
            />
          </div>
        </div>
      ))}

      <Modal open={selected !== null} onClose={() => setSelected(null)} label="Team details">
        {selected && <TeamDetail team={selected} drivers={drivers} />}
      </Modal>
    </div>
  )
}
