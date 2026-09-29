"use client"

import useSWR from "swr"
import {
  buildSchedule,
  fetchCalendar,
  fetchConstructorStandings,
  fetchDriverPhotos,
  fetchDriverStandings,
  fetchLastRace,
  fetchLatestSession,
  fetchLiveLeaderboard,
  fetchRaceDetail,
} from "@/lib/f1-api"
import type { Constructor, DriverStanding, LeaderboardRow, LiveSession, RaceDetailData, RaceEvent } from "@/lib/types"
import type { RaceResultsData } from "@/lib/f1-api"

const SEASON = "2026"

export interface SeasonData {
  drivers: DriverStanding[]
  round: number
  constructors: Constructor[]
  schedule: RaceEvent[]
  session: LiveSession | null
  isLive: boolean
}

/** One consolidated fetch for standings, calendar and live-session status. Refreshed every 5 min. */
export function useSeason() {
  return useSWR<SeasonData>(
    ["season", SEASON],
    async () => {
      const [ds, cs, races, session] = await Promise.all([
        fetchDriverStandings(SEASON),
        fetchConstructorStandings(SEASON),
        fetchCalendar(SEASON),
        fetchLatestSession().catch(() => null),
      ])
      const isLive = !!session?.isLive
      const liveDate = isLive ? session!.dateStart.slice(0, 10) : undefined
      return {
        drivers: ds.drivers,
        round: ds.round,
        constructors: cs,
        schedule: buildSchedule(races, ds.round, liveDate),
        session,
        isLive,
      }
    },
    { refreshInterval: 300_000, revalidateOnFocus: false },
  )
}

/** Live timing rows, polled every 3s. Only runs while a session is live. */
export function useLiveLeaderboard(enabled: boolean) {
  return useSWR<LeaderboardRow[]>(enabled ? ["live-leaderboard"] : null, () => fetchLiveLeaderboard(), {
    refreshInterval: enabled ? 3_000 : 0,
    revalidateOnFocus: false,
  })
}

/** Last completed race classification. Used as the fallback when nothing is live. */
export function useLastRace(enabled: boolean) {
  return useSWR<RaceResultsData | null>(enabled ? ["last-race"] : null, () => fetchLastRace(), {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
  })
}

/** Official driver headshots keyed by 3-letter code. Cached indefinitely for the session. */
export function useDriverPhotos() {
  return useSWR<Record<string, string>>(["driver-photos"], () => fetchDriverPhotos(), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 3_600_000,
  })
}

/** Results + qualifying + circuit for a single round. Only fetches when a round is selected. */
export function useRaceDetail(round: number | null, season = SEASON) {
  return useSWR<RaceDetailData | null>(
    round ? ["race-detail", season, round] : null,
    () => fetchRaceDetail(season, round as number),
    { revalidateOnFocus: false },
  )
}
