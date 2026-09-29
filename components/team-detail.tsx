"use client"

import type { Constructor, DriverStanding } from "@/lib/types"
import { FavButton } from "@/components/fav-button"
import { Flag } from "@/components/flag"
import { TeamLogo } from "@/components/team-logo"
import { teamWikiTitle } from "@/lib/f1-media"
import { useI18n } from "@/lib/i18n"

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

export function TeamDetail({ team, drivers }: { team: Constructor; drivers: DriverStanding[] }) {
  const { t, translateNationality } = useI18n() as any
  const color = team.color
  const lineup = drivers.filter((d) => d.teamId === team.id).sort((a, b) => b.points - a.points)
  const natTranslated = translateNationality(team.nationality)

  return (
    <div>
      <div
        className="relative px-5 pb-5 pt-8"
        style={{ background: `linear-gradient(135deg, ${color}33, transparent 70%)` }}
      >
        <span className="absolute inset-x-0 bottom-0 h-0.5" style={{ backgroundColor: color }} />
        <div className="flex items-start gap-3">
          <TeamLogo title={teamWikiTitle(team)?? team.name} name={team.name} color={color} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-bold text-foreground">{team.name}</h2>
              <FavButton kind="team" id={team.id} size="lg" />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flag nationality={team.nationality} />
              {natTranslated}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold tabular-nums text-foreground">{team.points}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("team.points")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="grid grid-cols-3 gap-2">
          <Info label={t("team.position")} value={`P${team.position}`} />
          <Info label={t("team.wins")} value={team.wins} />
          <Info label={t("team.nationality")} value={natTranslated} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("team.bio", {
            name: team.name,
            nationality: natTranslated.toLowerCase(),
            base: (team as any).base || "su sede",
            position: team.position,
            points: team.points,
            wins: team.wins,
          })}
        </p>

        {lineup.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{t("team.lineup")}</p>
            <ul className="space-y-1.5">
              {lineup.map((d) => (
                <li key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2">
                  <span className="w-8 font-mono text-xs font-bold tabular-nums" style={{ color }}>
                    #{d.number}
                  </span>
                  <span className="flex-1 truncate text-sm font-semibold text-foreground">{d.name}</span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">{d.points} {t("driver.pts")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}