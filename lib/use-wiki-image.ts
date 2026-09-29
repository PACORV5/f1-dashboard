"use client"

const TEAM_STYLE: Record<string, { abbr: string, color: string, text: string }> = {
  ferrari: { abbr: "FER", color: "#DC0000", text: "white" },
  mclaren: { abbr: "MCL", color: "#FF8700", text: "white" },
  redbull: { abbr: "RBR", color: "#0600EF", text: "white" },
  mercedes: { abbr: "MER", color: "#00D2BE", text: "black" },
  aston: { abbr: "AST", color: "#006F62", text: "white" },
  alpine: { abbr: "ALP", color: "#0090FF", text: "white" },
  williams: { abbr: "WIL", color: "#005AFF", text: "white" },
  rb: { abbr: "RB", color: "#2B4562", text: "white" },
  racingbulls: { abbr: "RB", color: "#2B4562", text: "white" },
  sauber: { abbr: "SAU", color: "#00E701", text: "black" },
  kick: { abbr: "SAU", color: "#00E701", text: "black" },
  haas: { abbr: "HAA", color: "#EEEEEE", text: "black" },
  audi: { abbr: "AUD", color: "#BB0A30", text: "white" },
  cadillac: { abbr: "CAD", color: "#111111", text: "white" },
}

function findTeam(name: string) {
  const low = name.toLowerCase()
  for (const k in TEAM_STYLE) if (low.includes(k)) return TEAM_STYLE[k]
  return null
}

function makeBadge(abbr: string, bg: string, fg: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" rx="28" fill="${bg}"/><text x="100" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="68" fill="${fg}">${abbr}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function driverAbbr(name: string) {
  const parts = name.trim().split(" ")
  const last = parts[parts.length - 1] || name
  return last.substring(0, 2).toUpperCase()
}

export function useWikiImage(name: string | null | undefined) {
  if (!name) return null

  // Equipo
  const team = findTeam(name)
  if (team) {
    return makeBadge(team.abbr, team.color, team.text)
  }

  // Piloto -> 2 letras del apellido
  const abbr = driverAbbr(name)
  return makeBadge(abbr, "#1A1A1A", "white")
}