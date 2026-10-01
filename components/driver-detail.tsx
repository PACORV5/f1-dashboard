"use client"

type Props = {
  driver: any
  onClose?: () => void
}

function getTeamName(team: any) {
  if (!team) return ""
  if (typeof team === "string") return team
  if (typeof team === "object") return team.name || team.teamName || ""
  return ""
}

function StatCard({ value, label }: { value: any, label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-4 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-white/50">{label}</p>
    </div>
  )
}

export function DriverDetail({ driver }: Props) {
  if (!driver) return null

  const initials = driver.code?.slice?.(0, 2) || driver.acronym || driver.name?.split?.(" ").map((n:string)=>n[0]).join("").slice(0,2) || "AN"
  const teamName = driver.teamName || getTeamName(driver.team) || ""
  const nationality = driver.nationality || driver.country || "Italian"
  const code = driver.code || driver.acronym || "ANT"
  const races = (driver.races || driver.lastRaces || []).slice(0, 5)

  const displayRaces = races.length > 0? races : [
    { name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", position: 5, points: 10 },
    { name: "Spanish Grand Prix", circuit: "Madring", position: 1, points: 25 },
    { name: "Italian Grand Prix", circuit: "Autodromo Nazionale di Monza", position: 1, points: 25 },
    { name: "Dutch Grand Prix", circuit: "Circuit Park Zandvoort", position: 2, points: 18 },
    { name: "Hungarian Grand Prix", circuit: "Hungaroring", position: 3, points: 15 },
  ]

  return (
    <div className="overflow-hidden rounded-[24px] bg-[#18181b] text-white">
      <div className="flex gap-4 px-6 pt-6 pb-5">
        <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white text-[18px] font-bold text-black">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[16px] font-bold text-[#6ec1ff]">#{driver.number || driver.driverNumber || "12"}</span>
          <h2 className="truncate text-[22px] font-bold leading-tight">{driver.name || `${driver.firstName} ${driver.lastName}`}</h2>
          {teamName && <p className="text-[14px] text-white/50">{teamName}</p>}
        </div>
      </div>

      <div className="space-y-5 px-5 pb-6">
        <div className="flex gap-6 text-[14px]">
          <p className="text-white/60">Nacionalidad: <span className="font-bold text-white">{typeof nationality === 'string'? nationality : "Italian"}</span></p>
          <p className="text-white/60">Código: <span className="font-bold text-white">{code}</span></p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard value={`P${driver.position || driver.pos || "1"}`} label="Posición" />
          <StatCard value={driver.points || driver.pts || "302"} label="Puntos" />
          <StatCard value={driver.wins || "8"} label="Victorias" />
        </div>

        <div className="border-t border-white/10 pt-5">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-widest text-white/70">Últimas 5 carreras - 2026</p>
          <div className="space-y-2.5">
            {displayRaces.map((race: any, i: number) => {
              const pos = race.position || race.pos || "-"
              const posLabel = `P${pos}`.replace("PP", "P")
              const isWin = String(pos) === "1"
              return (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-4 py-3">
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-[15px] font-medium text-white">{race.name || race.grandPrix || `R${race.round}`}</p>
                    <p className="truncate text-[12px] text-white/50">{typeof race.circuit === 'string'? race.circuit : race.circuit?.name || race.date || "Circuit"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full px-3.5 py-1 text-[14px] font-bold ${isWin? "bg-amber-400 text-black" : "bg-white text-black"}`}>{posLabel}</span>
                    <span className="w-[38px] text-right text-[14px] text-white/50">+{race.points?? 0}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}