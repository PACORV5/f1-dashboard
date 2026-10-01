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

export function TeamCard({ team, drivers, onOpen }: { team: Constructor; drivers: DriverStanding[]; onOpen: () => void }) {
  const lineup = drivers.filter((d) => d.teamId === team.id).sort((a, b) => b.points - a.points)
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
      <button type="button" onClick={onOpen} className="mt-3 flex items-end justify-between text-left">
        <ul className="min-w-0 space-y-0.5">
          {lineup.map((d) => (
            <li key={d.id} className="truncate text-xs text-muted-foreground">
              <span className="font-mono" style={{ color: team.color }}>{d.number}</span> {d.familyName}
            </li>
          ))}
        </ul>
        <div className="text-right">
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

  // Fix scroll lock: solo bloquea si hay alguno abierto
  useEffect(() => {
    const isOpen =!!selected ||!!selectedDriver
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [selected, selectedDriver])

  const enrichDriver = (d: DriverStanding) => {
    const team = teams.find((t) => t.id === d.teamId)
    return {
    ...d,
      teamName: team?.name,
      teamColor: team?.color,
      teamNationality: team?.nationality,
    }
  }

  const handleSelectDriverFromTeam = (d: any) => {
    // Cierra equipo primero
    setSelected(null)
    // Abre piloto después de que el Modal del equipo se desmonte
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

      {/* Solo renderiza UN modal a la vez */}
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