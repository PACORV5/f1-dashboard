export type RaceStatus = "FINISHED" | "LIVE" | "UPCOMING"

/** A driver row derived from the Ergast/Jolpica driverStandings endpoint. */
export interface DriverStanding {
  id: string // driverId, e.g. "antonelli"
  code: string // 3-letter code, e.g. "ANT"
  number: string // permanent number
  name: string // full name
  givenName: string
  familyName: string
  dob: string // ISO date
  nationality: string
  position: number
  points: number
  wins: number
  teamId: string // constructorId
  teamName: string
  teamColor: string
}

/** A constructor row derived from the constructorStandings endpoint. */
export interface Constructor {
  id: string // constructorId
  name: string
  nationality: string
  color: string
  position: number
  points: number
  wins: number
}

/** A calendar event with a computed status. */
export interface RaceEvent {
  round: number
  raceName: string
  circuitId?: string
  circuitName: string
  locality: string
  country: string
  lat?: string
  long?: string
  date: string
  time?: string
  status: RaceStatus
  daysUntil?: number
}

/** A classification row from a finished race's results endpoint. */
export interface RaceResultRow {
  position: number
  points: number
  number: string
  code: string
  driverName: string
  nationality?: string
  teamName: string
  teamColor: string
  grid: number
  laps: number
  status: string
  time?: string
  fastestLap?: string
}

/** A qualifying classification row (from the cached race-detail endpoint). */
export interface QualifyingResultRow {
  position: number
  code: string
  driverName: string
  nationality?: string
  teamId: string
  teamName: string
  q1?: string
  q2?: string
  q3?: string
}

/** A race classification row from the cached race-detail endpoint. */
export interface RaceDetailResultRow {
  position: number
  points: number
  number: string
  code: string
  driverName: string
  nationality?: string
  teamId: string
  teamName: string
  grid: number
  laps: number
  status: string
  time?: string
  fastestLap?: string
}

export interface RaceCircuit {
  circuitId: string
  circuitName: string
  locality?: string
  country?: string
  lat?: string
  long?: string
  url?: string
}

/** Combined results + qualifying + circuit payload served by /api/race. */
export interface RaceDetailData {
  raceName: string
  results: RaceDetailResultRow[]
  qualifying: QualifyingResultRow[]
  circuit: RaceCircuit | null
  cached?: boolean
}

/** A live timing row assembled from OpenF1 endpoints. */
export interface LeaderboardRow {
  position: number
  driverNumber: number
  code: string
  name: string
  teamName: string
  teamColor: string
  lastLap?: string
  gap?: string
  lap?: number
  tyre?: string // S/M/H/I/W
}

/** Metadata about the latest OpenF1 session. */
export interface LiveSession {
  sessionKey: number
  sessionName: string
  sessionType: string
  location: string
  countryName: string
  circuitShortName: string
  dateStart: string
  dateEnd: string
  year: number
  isLive: boolean
}

export type NotificationKind = "position" | "dnf" | "tyre" | "info"

export interface RaceNotification {
  id: string
  message: string
  kind: NotificationKind
  color: string
  ts: number
}
