"use client"

import { useState, useEffect } from "react"
import type { Constructor, DriverStanding } from "@/lib/types"
import { FavButton } from "@/components/fav-button"
import { Modal } from "@/components/modal"
import { TeamDetail } from "@/components/team-detail"
import { DriverDetail } from "@/components/driver-detail"
import { Flag } from "@/components/flag"
import { TeamLogo } from "@/components/team-logo"
import { teamWikiTitle } from "@/lib/f1-media"

function normalize(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "")
}

function getTeamLineup(team: Constructor, drivers: DriverStanding[]) {
  const tId = normalize(team.id)
  const tName = normalize(team.name)
  return drivers.filter((d: any) => {
    const dId = normalize(d.teamId || "")
    const dName = normalize(d.teamName || d.team?.name || "")
    const dConstructorId = normalize(d.Constructor?.constructorId || d.constructorId || "")
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
}

export function TeamCard({ team, drivers, onOpen }: { team: Constructor; drivers: DriverStanding[]; onOpen: () => void }) {
  const lineup = getTeamLineup(team, drivers)

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20">
      <div className="flex items-start gap-3">
        <TeamLogo title={teamWikiTitle(team)?? team.name} name={team.name} color={team.color} size={40} />
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-bold text-foreground">{team.name}</p>
          <p className="flex items-center gap-1.5 truncate text-[11px] uppercase tracking-wide text-muted-foreground">
            P{team.position} · <Flag nationality={team.nationality} /> {team.nationality}
          </p>
        </button>
        <FavButton kind="team" id={team.id} />
      </div>
      <button type="button" onClick={onOpen} className="mt-3 flex w-full items-end justify-between text-left">
        <ul className="min-w-0 space-y-0.5">
          {lineup.length > 0? lineup.map((d) => (
            <li key={d.id} className="truncate text-xs text-muted-foreground">
              <span className="font-mono font-bold" style={{ color: team.color }}>{d.number}</span> {d.familyName} · {d.points}pts
            </li>
          )) : (
            <li className="text-xs text-muted-foreground/50">Cargando pilotos...</li>
          )}
        </ul>
        <div className="text-right shrink-0 ml-2">
          <span className="font-mono text-lg font-bold tabular-nums text-foreground">{team.points}</span>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">pts</p>
        </div>
      </button>
    </div>
  )
}

export function TeamsPanel({ teams, drivers }: { teams: Constructor[]; drivers: DriverStanding[] }) {
  const [selected, setSelected] = useState<Constructor | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<any>(null)

  useEffect(() => {
    const isOpen =!!selected ||!!selectedDriver
    document.body.style.overflow = isOpen? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [selected, selectedDriver])

  const enrichDriver = (d: any) => {
    const team = teams.find((t) => t.id === d.teamId || t.name === d.teamId || normalize(t.id) === normalize(d.teamId))
    return {
     ...d,
      teamName: team?.name?? d.teamName?? d.teamId,
      teamColor: team?.color,
      teamNationality: team?.nationality,
    }
  }

  const handleSelectDriverFromTeam = (d: any) => {
    setSelected(null)
    setTimeout(() => {
      setSelectedDriver(enrichDriver(d))
    }, 350)
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <TeamCard key={t.id} team={t} drivers={drivers} onOpen={() => setSelected(t)} />
        ))}
      </div>

      {selected &&!selectedDriver && (
        <Modal open={true} onClose={() => setSelected(null)} label="Team details">
          <TeamDetail
            team={selected}
            drivers={drivers}
            onSelectDriver={handleSelectDriverFromTeam}
          />
        </Modal>
      )}

      {selectedDriver && (
        <Modal open={true} onClose={() => setSelectedDriver(null)} label="Driver details">
          <DriverDetail driver={selectedDriver} />
        </Modal>
      )}
    </div>
  )
}