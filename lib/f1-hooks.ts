"use client"

import useSWR from "swr"
import {
  buildSchedule,
  fetchCalendar,
  fetchConstructorStandings,
  fetchDriverStandings,
  fetchDriverPhotos,
  fetchLastRace,
  fetchLatestSession,
  fetchLiveLeaderboard,
  fetchResults,
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
      const schedule = buildSchedule(races, ds.round, liveDate)

      // últimas 5 terminadas
      const completed = schedule.filter((r:any) => r.status === "FINISHED").slice(-5)
      // si no hay status, usa las últimas 5 por round
      const toFetch = completed.length ? completed : schedule.slice(-5)

      const resultsByRound: Record<number, RaceResultsData> = {}
      await Promise.all(
        toFetch.map(async (r:any) => {
          try {
            const data = await fetchResults(SEASON, r.round)
            if (data) resultsByRound[r.round] = data
          } catch {}
        })
      )

      const driversWithLast5 = ds.drivers.map((driver:any) => {
        const last5 = toFetch.map((race:any) => {
          const data = resultsByRound[race.round]
          const res = data?.rows?.find((x:any) => 
            x.code?.toLowerCase() === driver.code?.toLowerCase() ||
            String(x.number) === String(driver.number)
          )
          return {
            raceName: race.raceName,
            circuit: race.circuitName || race.locality || "",
            position: res?.position ? String(res.position) : "-",
            points: res?.points ?? 0,
          }
        }).reverse()

        return { ...driver, last5, recentRaces: last5 }
      })

      return {
        drivers: driversWithLast5,
        round: ds.round,
        constructors: cs,
        schedule,
        session,
        isLive,
      }
    },
    { refreshInterval: 300_000, revalidateOnFocus: false },
  )
}

export function useLiveLeaderboard(enabled: boolean) {
  return useSWR<LeaderboardRow[]>(enabled ? ["live-leaderboard"] : null, () => fetchLiveLeaderboard(), {
    refreshInterval: enabled ? 3_000 : 0,
    revalidateOnFocus: false,
  })
}

export function useLastRace(enabled: boolean) {
  return useSWR<RaceResultsData | null>(enabled ? ["last-race"] : null, () => fetchLastRace(), {
    refreshInterval: 300_000,
    revalidateOnFocus: false,
  })
}

export function useDriverPhotos() {
  return useSWR<Record<string, string>>(["driver-photos"], () => fetchDriverPhotos(), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 3_600_000,
  })
}

export function useRaceDetail(round: number | null, season = SEASON) {
  return useSWR<RaceDetailData | null>(
    round ? ["race-detail", season, round] : null,
    () => fetchRaceDetail(season, round as number),
    { revalidateOnFocus: false },
  )
}