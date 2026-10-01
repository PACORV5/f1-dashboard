"use client"
import { DriverDetail } from "./driver-detail"

type Props = {
  team: any
  driversList?: any[]
  onClose: () => void
  onSelectDriver?: (d: any) => void
}

export function TeamDetail({ team, driversList = [], onClose, onSelectDriver }: Props) {
  const teamName = team.name || team.teamName || "Team"
  const lineup = team.drivers || team.lineup || team.pilots || []

  const handlePilotClick = (p: any, e: React.MouseEvent) => {
    e.stopPropagation()
    // busca el piloto completo para que no truene el modal
    const full = driversList.find(
      (d) => d.code === p.code || d.acronym === p.code || d.name === p.name || `${d.firstName} ${d.lastName}` === p.name
    ) || p

    if (onSelectDriver) {
      onSelectDriver(full)
    }
  }

  return (
    <div className="space-y-5 text-white">
      <div className="flex gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black font-bold">
          {teamName.slice(0,2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-[22px] font-bold">{teamName}</h2>
          <p className="text-sm text-white/50">{team.nationality || ""}</p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        <p className="mb-3 text-[11px] font-bold tracking-widest text-white/60">ALINEACIÓN 2026</p>
        <div className="grid grid-cols-1 gap-2">
          {lineup.map((p: any, i: number) => (
            <button
              key={i}
              type="button"
              onClick={(e) => handlePilotClick(p, e)}
              className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 text-left hover:bg-white/[0.10] transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black font-bold text-sm">
                {p.code?.slice(0,2) || p.name?.slice(0,2) || "AN"}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-medium">{p.name || `${p.firstName} ${p.lastName}`}</p>
                <p className="text-xs text-white/50">#{p.number || p.driverNumber || "-"} • {p.code || ""}</p>
              </div>
            </button>
          ))}
          {lineup.length === 0 && (
            <p className="py-6 text-center text-sm text-white/40">Sin pilotos</p>
          )}
        </div>
      </div>
    </div>
  )
}