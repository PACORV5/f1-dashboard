"use client"

import type { DriverStanding } from "@/lib/types"
import { ageFromDob } from "@/lib/f1-utils"
import { FavButton } from "@/components/fav-button"
import { DriverAvatar } from "@/components/driver-avatar"
import { Flag } from "@/components/flag"
import { useI18n } from "@/lib/i18n"

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5 text-center">
      <p className="font-mono text-lg font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  )
}

export function DriverDetail({ driver }: { driver: DriverStanding }) {
  const { t, translateNationality } = useI18n() as any
  const age = ageFromDob(driver.dob)
  const color = driver.teamColor
  const natTranslated = translateNationality(driver.nationality)

  return (
    <div>
      <div
        className="relative flex items-center gap-4 px-5 pb-5 pt-8"
        style={{ background: `linear-gradient(135deg, ${color}33, transparent 70%)` }}
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
          <h2 className="truncate text-xl font-bold text-foreground">{driver.name}</h2>
          <p className="truncate text-sm text-muted-foreground">{driver.teamName}</p>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{t("driver.nationality")}: </span>
            <Flag nationality={driver.nationality} />
            <span className="font-medium text-foreground">{natTranslated}</span>
          </div>
          {age!== null && (
            <div>
              <span className="text-muted-foreground">{t("driver.age")}: </span>
              <span className="font-medium text-foreground">{age}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">{t("driver.code")}: </span>
            <span className="font-medium text-foreground">{driver.code}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat label={t("driver.position")} value={`P${driver.position}`} />
          <Stat label={t("driver.points")} value={driver.points} />
          <Stat label={t("driver.wins")} value={driver.wins} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
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
      </div>
    </div>
  )
}