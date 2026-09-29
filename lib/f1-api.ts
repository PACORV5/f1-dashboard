import type {
  Constructor,
  DriverStanding,
  LeaderboardRow,
  LiveSession,
  RaceDetailData,
  RaceEvent,
  RaceResultRow,
  RaceStatus,
} from "@/lib/types"
import { compoundToCode, formatGap, formatLapTime } from "@/lib/f1-utils"

const JOLPI = "https://api.jolpi.ca/ergast/f1"
const OPENF1 = "https://api.openf1.org/v1"
const TTL = 5 * 60 * 1000 // 5 minutes

/** Presentation colors keyed by constructorId. Colors are styling, not championship data. */
export const TEAM_COLORS: Record<string, string> = {
  mercedes: "#27F4D2",
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  aston_martin: "#229971",
  alpine: "#0093CC",
  williams: "#64C4FF",
  rb: "#6692FF",
  alphatauri: "#6692FF",
  sauber: "#52E252",
  kick_sauber: "#52E252",
  haas: "#B6BABD",
  audi: "#00847E",
  cadillac: "#B0122B",
}

export function teamColor(id?: string): string {
  if (!id) return "#9CA3AF"
  return TEAM_COLORS[id] ?? "#9CA3AF"
}

function cacheGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { ts: number; data: T }
    if (Date.now() - parsed.ts > TTL) return null
    return parsed.data
  } catch {
    return null
  }
}

function cacheSet(key: string, data: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }))
  } catch {
    // ignore quota / serialization errors
  }
}

async function getJSON<T>(url: string, useCache = true): Promise<T> {
  const key = "f1cache:" + url
  if (useCache) {
    const cached = cacheGet<T>(key)
    if (cached !== null) return cached
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`)
  const json = (await res.json()) as T
  if (useCache) cacheSet(key, json)
  return json
}

/* --------------------------- Jolpica (Ergast) --------------------------- */

export async function fetchDriverStandings(season = "2026"): Promise<{ round: number; drivers: DriverStanding[] }> {
  const j = await getJSON<any>(`${JOLPI}/${season}/driverStandings.json`)
  const list = j?.MRData?.StandingsTable?.StandingsLists?.[0]
  const round = Number(list?.round ?? 0)
  const drivers: DriverStanding[] = (list?.DriverStandings ?? []).map((s: any) => {
    const d = s.Driver
    const c = s.Constructors[s.Constructors.length - 1]
    return {
      id: d.driverId,
      code: d.code ?? d.familyName.slice(0, 3).toUpperCase(),
      number: d.permanentNumber ?? "",
      name: `${d.givenName} ${d.familyName}`,
      givenName: d.givenName,
      familyName: d.familyName,
      dob: d.dateOfBirth,
      nationality: d.nationality,
      position: Number(s.position),
      points: Number(s.points),
      wins: Number(s.wins),
      teamId: c.constructorId,
      teamName: c.name,
      teamColor: teamColor(c.constructorId),
    }
  })
  return { round, drivers }
}

export async function fetchConstructorStandings(season = "2026"): Promise<Constructor[]> {
  const j = await getJSON<any>(`${JOLPI}/${season}/constructorStandings.json`)
  const list = j?.MRData?.StandingsTable?.StandingsLists?.[0]
  return (list?.ConstructorStandings ?? []).map((s: any) => {
    const c = s.Constructor
    return {
      id: c.constructorId,
      name: c.name,
      nationality: c.nationality,
      color: teamColor(c.constructorId),
      position: Number(s.position),
      points: Number(s.points),
      wins: Number(s.wins),
    }
  })
}

export async function fetchCalendar(season = "2026"): Promise<any[]> {
  const j = await getJSON<any>(`${JOLPI}/${season}.json`)
  return j?.MRData?.RaceTable?.Races ?? []
}

/**
 * Reference "now" for countdowns. Uses the real clock, but never earlier than
 * the latest finished race, so countdowns stay correct regardless of the host clock.
 */
function referenceNow(latestFinishedDate?: string): Date {
  const real = new Date()
  if (!latestFinishedDate) return real
  const anchor = new Date(latestFinishedDate + "T18:00:00Z")
  return real.getTime() > anchor.getTime() ? real : anchor
}

export function buildSchedule(races: any[], latestRound: number, liveDate?: string): RaceEvent[] {
  const latestDate = races.find((r) => Number(r.round) === latestRound)?.date
  const now = referenceNow(latestDate)
  return races.map((r) => {
    const round = Number(r.round)
    let status: RaceStatus = round <= latestRound ? "FINISHED" : "UPCOMING"
    if (liveDate && r.date === liveDate) status = "LIVE"
    const start = new Date(`${r.date}T${r.time ?? "00:00:00Z"}`)
    const daysUntil =
      status === "UPCOMING" ? Math.max(0, Math.ceil((start.getTime() - now.getTime()) / 86_400_000)) : undefined
    return {
      round,
      raceName: r.raceName,
      circuitId: r.Circuit.circuitId,
      circuitName: r.Circuit.circuitName,
      locality: r.Circuit.Location.locality,
      country: r.Circuit.Location.country,
      lat: r.Circuit.Location.lat,
      long: r.Circuit.Location.long,
      date: r.date,
      time: r.time,
      status,
      daysUntil,
    }
  })
}

function mapResults(results: any[]): RaceResultRow[] {
  return results.map((res: any) => ({
    position: Number(res.position),
    points: Number(res.points),
    number: res.number,
    code: res.Driver.code ?? res.Driver.familyName.slice(0, 3).toUpperCase(),
    driverName: `${res.Driver.givenName} ${res.Driver.familyName}`,
    nationality: res.Driver.nationality,
    teamName: res.Constructor.name,
    teamColor: teamColor(res.Constructor.constructorId),
    grid: Number(res.grid),
    laps: Number(res.laps),
    status: res.status,
    time: res.Time?.time,
    fastestLap: res.FastestLap?.Time?.time,
  }))
}

export interface RaceResultsData {
  race: { raceName: string; circuitName: string; locality: string; country: string; date: string; round: number }
  rows: RaceResultRow[]
}

function extractResults(race: any): RaceResultsData {
  return {
    race: {
      raceName: race.raceName,
      circuitName: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
      date: race.date,
      round: Number(race.round),
    },
    rows: mapResults(race.Results ?? []),
  }
}

export async function fetchResults(season: string, round: number): Promise<RaceResultsData | null> {
  const j = await getJSON<any>(`${JOLPI}/${season}/${round}/results.json`)
  const race = j?.MRData?.RaceTable?.Races?.[0]
  return race ? extractResults(race) : null
}

export async function fetchLastRace(): Promise<RaceResultsData | null> {
  const j = await getJSON<any>(`${JOLPI}/current/last/results.json`)
  const race = j?.MRData?.RaceTable?.Races?.[0]
  return race ? extractResults(race) : null
}

/* ------------------------------- OpenF1 -------------------------------- */

export async function fetchLatestSession(): Promise<LiveSession | null> {
  const arr = await getJSON<any[]>(`${OPENF1}/sessions?session_key=latest`, false)
  const s = arr?.[0]
  if (!s) return null
  const isLive = !s.is_cancelled && new Date(s.date_end).getTime() > Date.now() && new Date(s.date_start).getTime() <= Date.now()
  return {
    sessionKey: s.session_key,
    sessionName: s.session_name,
    sessionType: s.session_type,
    location: s.location,
    countryName: s.country_name,
    circuitShortName: s.circuit_short_name,
    dateStart: s.date_start,
    dateEnd: s.date_end,
    year: s.year,
    isLive,
  }
}

function latestByKey(arr: any[], value: (x: any) => number): Map<number, any> {
  const m = new Map<number, any>()
  for (const x of arr) {
    const num = x.driver_number
    const cur = m.get(num)
    if (!cur || value(x) >= value(cur)) m.set(num, x)
  }
  return m
}

export async function fetchLiveLeaderboard(): Promise<LeaderboardRow[]> {
  const [drivers, positions, laps, intervals, stints] = await Promise.all([
    getJSON<any[]>(`${OPENF1}/drivers?session_key=latest`, false).catch(() => []),
    getJSON<any[]>(`${OPENF1}/position?session_key=latest`, false).catch(() => []),
    getJSON<any[]>(`${OPENF1}/laps?session_key=latest`, false).catch(() => []),
    getJSON<any[]>(`${OPENF1}/intervals?session_key=latest`, false).catch(() => []),
    getJSON<any[]>(`${OPENF1}/stints?session_key=latest`, false).catch(() => []),
  ])

  const dmap = new Map<number, any>()
  for (const d of drivers) dmap.set(d.driver_number, d)

  const posMap = latestByKey(positions, (x) => new Date(x.date).getTime())
  const lapMap = latestByKey(laps, (x) => x.lap_number ?? 0)
  const intMap = latestByKey(intervals, (x) => new Date(x.date).getTime())
  const stintMap = latestByKey(stints, (x) => x.stint_number ?? 0)

  const rows: LeaderboardRow[] = []
  for (const [num, pos] of posMap) {
    const d = dmap.get(num)
    const lap = lapMap.get(num)
    const iv = intMap.get(num)
    const st = stintMap.get(num)
    rows.push({
      position: pos.position,
      driverNumber: num,
      code: d?.name_acronym ?? String(num),
      name: d?.full_name ?? d?.broadcast_name ?? `#${num}`,
      teamName: d?.team_name ?? "",
      teamColor: d?.team_colour ? `#${d.team_colour}` : "#9CA3AF",
      lastLap: formatLapTime(lap?.lap_duration),
      gap: formatGap(iv?.gap_to_leader),
      lap: lap?.lap_number,
      tyre: compoundToCode(st?.compound),
    })
  }
  rows.sort((a, b) => a.position - b.position)
  return rows
}

/**
 * Official driver headshots keyed by 3-letter acronym, sourced from OpenF1's
 * latest session. Returns an empty map on any failure so callers fall back to
 * initials avatars.
 */
export async function fetchDriverPhotos(): Promise<Record<string, string>> {
  try {
    const arr = await getJSON<any[]>(`${OPENF1}/drivers?session_key=latest`, false)
    const map: Record<string, string> = {}
    for (const d of arr) {
      if (d.name_acronym && d.headshot_url) map[d.name_acronym] = d.headshot_url
    }
    return map
  } catch {
    return {}
  }
}

/** Combined race results + qualifying + circuit for one round, via the cached API route. */
export async function fetchRaceDetail(season: string, round: number): Promise<RaceDetailData | null> {
  try {
    const res = await fetch(`/api/race?season=${season}&round=${round}`)
    if (!res.ok) return null
    return (await res.json()) as RaceDetailData
  } catch {
    return null
  }
}
