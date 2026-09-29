"use client"

import { useMemo, useState } from "react"
import { useLastRace, useLiveLeaderboard, useSeason } from "@/lib/f1-hooks"
import { useFavorites } from "@/components/favorites-provider"
import { useRaceNotifications } from "@/components/use-race-notifications"
import { F1Header } from "@/components/f1-header"
import { LiveLeaderboard } from "@/components/live-leaderboard"
import { ResultsTable } from "@/components/results-table"
import { DriverStandings } from "@/components/driver-standings"
import { ConstructorStandings } from "@/components/constructor-standings"
import { SessionSchedule } from "@/components/session-schedule"
import { DriversPanel } from "@/components/drivers-panel"
import { TeamsPanel } from "@/components/teams-panel"
import { FavoritesPanel } from "@/components/favorites-panel"
import { useI18n } from "@/lib/i18n"

type Tab = "live" | "drivers" | "teams" | "schedule" | "directory" | "favorites"

const TABS: { id: Tab; key: string }[] = [
  { id: "live", key: "nav.live" },
  { id: "drivers", key: "nav.drivers" },
  { id: "teams", key: "nav.teams" },
  { id: "directory", key: "nav.grid" },
  { id: "schedule", key: "nav.schedule" },
  { id: "favorites", key: "nav.favorites" },
]

export function F1Live() {
  const { t } = useI18n()
  const [tab, setTab] = useState<Tab>("live")
  const { data: season, isLoading, error } = useSeason()
  const isLive = !!season?.isLive

  const { data: liveRows } = useLiveLeaderboard(isLive)
  const { data: lastRace } = useLastRace(!isLive)

  const fav = useFavorites()

  const favDriverCodes = useMemo(
    () => (season?.drivers ?? []).filter((d) => fav.isDriverFav(d.code)).map((d) => d.code),
    [season?.drivers, fav],
  )
  const favTeamNames = useMemo(
    () => (season?.constructors ?? []).filter((t) => fav.isTeamFav(t.id)).map((t) => t.name),
    [season?.constructors, fav],
  )
  const { items: notifications, clear } = useRaceNotifications(liveRows ?? [], favDriverCodes, favTeamNames)
  const hasFavorites = fav.drivers.length + fav.teams.length > 0

  const drivers = season?.drivers ?? []
  const constructors = season?.constructors ?? []

  return (
    <div className="min-h-dvh bg-background">
      <F1Header
        session={season?.session ?? null}
        isLive={isLive}
        notifications={notifications}
        onClearNotifications={clear}
        hasFavorites={hasFavorites}
      />

      <nav className="sticky top-[73px] z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 py-2">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                tab === tb.id
                  ? "bg-f1-red text-white"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {t(tb.key)}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {isLoading && (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            {t("loading.season")}
          </div>
        )}

        {error && !season && (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-center">
            <p className="text-sm font-semibold text-foreground">{t("error.title")}</p>
            <p className="text-sm text-muted-foreground">{t("error.sub")}</p>
          </div>
        )}

        {season && (
          <>
            {tab === "live" && (
              <section className="space-y-4">
                <SectionHeading
                  title={isLive ? t("live.timing") : t("live.lastRace")}
                  subtitle={
                    isLive
                      ? `${season.session?.location ?? ""} · ${season.session?.sessionName ?? ""}`
                      : lastRace
                        ? `${lastRace.race.raceName} · ${lastRace.race.locality}, ${lastRace.race.country}`
                        : t("live.awaiting")
                  }
                />
                {!isLive && (
                  <p className="rounded-lg border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
                    {t("live.noSession")}
                  </p>
                )}
                {isLive ? <LiveLeaderboard rows={liveRows ?? []} /> : <ResultsTable rows={lastRace?.rows ?? []} />}
              </section>
            )}

            {tab === "drivers" && (
              <section className="space-y-4">
                <SectionHeading title={t("drivers.title")} subtitle={t("standings.afterRound", { round: season.round })} />
                <DriverStandings standings={drivers} />
              </section>
            )}

            {tab === "teams" && (
              <section className="space-y-4">
                <SectionHeading title={t("teams.title")} subtitle={t("standings.afterRound", { round: season.round })} />
                <ConstructorStandings standings={constructors} drivers={drivers} />
              </section>
            )}

            {tab === "directory" && (
              <section className="space-y-6">
                <div className="space-y-4">
                  <SectionHeading title={t("grid.driversTitle")} subtitle={t("grid.driversSub")} />
                  <DriversPanel drivers={drivers} />
                </div>
                <div className="space-y-4">
                  <SectionHeading title={t("grid.teamsTitle")} subtitle={t("grid.teamsSub")} />
                  <TeamsPanel teams={constructors} drivers={drivers} />
                </div>
              </section>
            )}

            {tab === "schedule" && (
              <section className="space-y-4">
                <SectionHeading title={t("calendar.title")} subtitle={t("calendar.rounds", { count: season.schedule.length })} />
                <p className="text-xs text-muted-foreground">{t("calendar.tapForDetails")}</p>
                <SessionSchedule races={season.schedule} />
              </section>
            )}

            {tab === "favorites" && (
              <section className="space-y-4">
                <SectionHeading title={t("fav.title")} subtitle={t("fav.sub")} />
                <FavoritesPanel drivers={drivers} teams={constructors} />
              </section>
            )}
          </>
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-[11px] text-muted-foreground">{t("footer.credit")}</p>
      </footer>
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-l-2 border-f1-red pl-3">
      <h1 className="text-lg font-bold tracking-tight text-foreground">{title}</h1>
      <span className="truncate text-right text-[11px] uppercase tracking-widest text-muted-foreground">{subtitle}</span>
    </div>
  )
}
