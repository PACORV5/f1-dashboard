"use client"
import { X, MapPin, Trophy, Timer, Flag, TrendingUp } from "lucide-react"

type Props = {
  driver: any
  onClose?: () => void
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-[#27272a]">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-white">{value}</div>
    </div>
  )
}

function RaceRow({ race }: { race: any }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-[#27272a]">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-700">
          <MapPin className="h-4 w-4 text-zinc-500 dark:text-zinc-300" />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">{race.name || race.grandPrix || `R${race.round}`}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{race.circuit || race.date}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-zinc-900 dark:text-white">P{race.position || race.pos || "-"}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{race.points? `${race.points} pts` : race.time || ""}</div>
      </div>
    </div>
  )
}

export function DriverDetail({ driver, onClose }: Props) {
  if (!driver) return null

  const teamColor = driver.teamColor || driver.color || "#ff1801"

  return (
    <div className="overflow-hidden bg-transparent">
      {/* Header */}
      <div className="relative p-6" style={{ backgroundColor: teamColor }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60" />
        <div className="relative flex items-start gap-4">
          <img src={driver.image || driver.photo || "/placeholder.svg"} alt={driver.name} className="h-20 w-20 rounded-2xl border-2 border-white/20 object-cover shadow-xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">#{driver.number || driver.driverNumber}</span>
              <span className="rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">{driver.team || driver.constructor}</span>
            </div>
            <h2 className="mt-3 text-2xl font-black leading-none text-white">{driver.name || `${driver.firstName} ${driver.lastName}`}</h2>
            <p className="mt-1 text-sm font-medium text-white/80">{driver.country || driver.nationality}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Posición" value={driver.position || driver.pos || "-"} />
          <Stat label="Puntos" value={driver.points || driver.pts || "0"} />
          <Stat label="Victorias" value={driver.wins || "0"} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-[#27272a]">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Trophy className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Podios</span>
            </div>
            <div className="mt-2 text-xl font-black text-zinc-900 dark:text-white">{driver.podiums || "0"}</div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-[#27272a]">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Timer className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Vueltas Rápidas</span>
            </div>
            <div className="mt-2 text-xl font-black text-zinc-900 dark:text-white">{driver.fastestLaps || "0"}</div>
          </div>
        </div>

        {driver.races && driver.races.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Flag className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">Últimas Carreras</h3>
            </div>
            <div className="space-y-2">
              {driver.races.slice(0, 5).map((r: any, i: number) => (
                <RaceRow key={i} race={r} />
              ))}
            </div>
          </div>
        )}

        {driver.bio && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-[#27272a]">
            <div className="mb-2 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <TrendingUp className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Biografía</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{driver.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}