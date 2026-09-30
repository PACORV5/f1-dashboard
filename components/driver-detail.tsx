"use client"

import type { DriverStanding } from "@/lib/types"
import { ageFromDob } from "@/lib/f1-utils"
import { FavButton } from "@/components/fav-button"
import { DriverAvatar } from "@/components/driver-avatar"
import { Flag } from "@/components/flag"
import { useI18n } from "@/lib/i18n"

type RaceResult = {
  name: string
  circuit: string
  position: string
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/80 px-3 py-3 text-center">
      <p className="font-mono text-xl font-bold tabular-nums text-zinc-900 dark:text-white">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  )
}

function RaceRow({ race }: { race: RaceResult }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-[#27272a] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-zinc-900 dark:text-white">{race.name}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{race.circuit}</p>
      </div>
      <span className="ml-3 shrink-0 rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-bold text-zinc-900 dark:bg-zinc-700 dark:text-white">
        {race.position}
      </span>
    </div>
  )
}

export function DriverDetail({ driver }: { driver: DriverStanding & { recentRaces?: RaceResult[] } }) {
  const { t, translateNationality } = useI18n() as any
  const age = ageFromDob(driver.dob)
  const color = driver.teamColor
  const natTranslated = translateNationality(driver.nationality)

  // Si tu driver ya trae carreras úsalas, si no usa las de ejemplo de tu foto
  const races: RaceResult[] = (driver as any).recentRaces || [
    { name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", position: "P19" },
    { name: "Spanish Grand Prix", circuit: "Circuit de Catalunya", position: "P18" },
    { name: "Monaco Grand Prix", circuit: "Circuit de Monaco", position: "P14" },
    { name: "Emilia Romagna Grand Prix", circuit: "Autodromo Enzo e Dino Ferrari", position: "P19" },
    { name: "Miami Grand Prix", circuit: "Miami International Autodrome", position: "P19" },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 dark:border-white/10 dark:bg-[#18181b] dark:text-white">
      {/* Header */}
      <div
        className="relative flex items-center gap-4 px-5 pb-5 pt-8"
        style={{ background: `linear-gradient(135deg, ${color}22, transparent 75%)` }}
      >
        <span className="absolute inset-x-0 bottom-0 h-0.5" style={{ backgroundColor: color }} />
        <DriverAvatar name={driver.name} color={color} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tabular-nums" style={{ color }}>
              #{driver.number}
            </span>
            <FavButton kind="driver" id={driver.code} size="lg" />
          </div>
          <h2 className="truncate text-xl font-bold text-zinc-900 dark:text-white">{driver.name}</h2>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{driver.teamName}</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Info */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 dark:text-zinc-400">{t("driver.nationality")}: </span>
            <Flag nationality={driver.nationality} />
            <span className="font-medium text-zinc-900 dark:text-white">{natTranslated}</span>
          </div>
          {age!== null && (
            <div>
              <span className="text-zinc-500 dark:text-zinc-400">{t("driver.age")}: </span>
              <span className="font-medium text-zinc-900 dark:text-white">{age}</span>
            </div>
          )}
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">{t("driver.code")}: </span>
            <span className="font-medium text-zinc-900 dark:text-white">{driver.code}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label={t("driver.position")} value={`P${driver.position}`} />
          <Stat label={t("driver.points")} value={driver.points} />
          <Stat label={t("driver.wins")} value={driver.wins} />
        </div>

        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {t("driver.bio", {
            name: driver.name,
            nationality: natTranslated.toLowerCase(),
            team: driver.teamName,
            number: driver.number,
            position: driver.position,
            points: driver.points,
            wins: driver.wins,
          })}
        </p>

        {/* Ultimas carreras - ESTO era lo que se veía mal */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {t("driver.lastRaces") || "ÚLTIMAS 5 CARRERAS"}
          </h3>
          <div className="space-y-2">
            {races.map((r) => (
              <RaceRow key={r.name} race={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
