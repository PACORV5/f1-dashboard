import type { Constructor, DriverStanding } from "@/lib/types"

export function ageFromDob(dob: string | null): number | null {
  if (!dob) return null
  const birth = new Date(dob + "T00:00:00")
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

export const TYRE_NAMES: Record<string, string> = {
  S: "Soft",
  M: "Medium",
  H: "Hard",
  I: "Intermediate",
  W: "Wet",
}

export function tyreName(t: string | null | undefined): string {
  if (!t) return "Unknown"
  return TYRE_NAMES[t] ?? t
}

/** Maps an OpenF1 tyre compound ("SOFT", "MEDIUM"...) to a single-letter code. */
export function compoundToCode(c?: string | null): string | undefined {
  if (!c) return undefined
  const map: Record<string, string> = {
    SOFT: "S",
    MEDIUM: "M",
    HARD: "H",
    INTERMEDIATE: "I",
    WET: "W",
  }
  return map[c.toUpperCase()] ?? c[0]?.toUpperCase()
}

/** Formats a lap duration in seconds (e.g. 94.123) as m:ss.mmm. */
export function formatLapTime(sec?: number | null): string | undefined {
  if (sec == null || Number.isNaN(sec)) return undefined
  const m = Math.floor(sec / 60)
  const s = sec - m * 60
  return `${m}:${s.toFixed(3).padStart(6, "0")}`
}

/** Formats an OpenF1 gap_to_leader value, which can be a number or a "+1 LAP" string. */
export function formatGap(gap?: number | string | null): string | undefined {
  if (gap == null) return undefined
  if (typeof gap === "string") return gap
  if (gap === 0) return "LEADER"
  return `+${gap.toFixed(3)}`
}

/** Short human date, e.g. "08 Mar". */
export function shortDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

export function driverBlurb(d: DriverStanding): string {
  const winsText = d.wins > 0 ? ` with ${d.wins} win${d.wins > 1 ? "s" : ""} so far this campaign` : ""
  return `${d.name} is a ${d.nationality} driver competing for ${d.teamName} under number ${d.number}. They currently sit P${d.position} in the 2026 Drivers' Championship on ${d.points} point${d.points === 1 ? "" : "s"}${winsText}.`
}

export function teamBlurb(t: Constructor, lineup: DriverStanding[]): string {
  const names = lineup.map((d) => d.name).join(" and ")
  const winsText = t.wins > 0 ? ` and has taken ${t.wins} race win${t.wins > 1 ? "s" : ""} this season` : ""
  const lineupText = names ? ` The 2026 driver lineup features ${names}.` : ""
  return `${t.name} is a ${t.nationality} constructor sitting P${t.position} in the 2026 Constructors' Championship with ${t.points} point${t.points === 1 ? "" : "s"}${winsText}.${lineupText}`
}
