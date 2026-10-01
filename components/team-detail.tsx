"use client"

import type { Constructor, DriverStanding } from "@/lib/types"
import { Flag } from "@/components/flag"
import { TeamLogo } from "@/components/team-logo"
import { teamWikiTitle } from "@/lib/f1-media"

function normalize(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "")
}

export function TeamDetail({
  team,
  drivers,
  onSelectDriver,
}: {
  team: Constructor
  drivers: DriverStanding[]
  onSelectDriver?: (d: any) => void
}) {
  const tId = normalize(team.id)
  const tName = normalize(team.name)

  const lineup = (drivers || []).filter((d: any) => {
    const dId = normalize(d.teamId || "")
    const dName = normalize(d.teamName || d.Constructor?.name || d.constructorId || "")
    const dConstructorId = normalize(d.Constructor?.constructorId || "")
    return (
      dId === tId ||
      dId === tName ||
      dName === tName ||
      dName === tId ||
      dConstructorId === tId ||
      d.teamId === team.name ||
      d.teamId === team.id
    )
  }).sort((a,b) => b.points - a.points)

  return (
    <div className="space-y-5 p-1">
      <div className="flex items-start gap-4">
        <TeamLogo title={teamWikiTitle(team)?? team.name} name={team.name} color={team.color} size={56} />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-foreground">{team.name}</h2>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Flag nationality={team.nationality} /> {team.nationality} · P{team.position} · {team.points} pts
          </p>
          <div className="mt-2 h-1 w-full rounded-full" style={{ background: team.color }} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Pilotos · {lineup.length}
        </h3>
        <div className="grid gap-2">
          {lineup.length > 0? lineup.map((d: any) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDriver?.(d)}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.04]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  <span className="font-mono mr-2" style={{ color: team.color }}>#{d.number}</span>
                  {d.givenName} {d.familyName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  P{d.position} · {d.points} pts · {d.code}
                </p>
              </div>
              <span className="ml-2 shrink-0 text-xs text-muted-foreground">→</span>
            </button>
          )) : (
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No se encontraron pilotos para este equipo. teamId: {team.id}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-foreground/[0.03] p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Constructor: <span className="font-semibold text-foreground">{team.name}</span> ·
          Base: {team.nationality} · Total: {team.points} pts ·
          Posición: P{team.position}
        </p>
      </div>
    </div>
  )
}