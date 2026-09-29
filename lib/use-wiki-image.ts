"use client"
import { useEffect, useState } from "react"

const TEAM_STYLE: Record<string, { abbr: string, color: string }> = {
  ferrari: { abbr: "FER", color: "#DC0000" },
  mclaren: { abbr: "MCL", color: "#FF8700" },
  redbull: { abbr: "RBR", color: "#0600EF" },
  mercedes: { abbr: "MER", color: "#00D2BE" },
  aston: { abbr: "AST", color: "#006F62" },
  alpine: { abbr: "ALP", color: "#0090FF" },
  williams: { abbr: "WIL", color: "#005AFF" },
  rb: { abbr: "RB", color: "#2B4562" },
  racingbulls: { abbr: "RB", color: "#2B4562" },
  sauber: { abbr: "SAU", color: "#00E701" },
  kick: { abbr: "SAU", color: "#00E701" },
  haas: { abbr: "HAA", color: "#FFFFFF" },
  audi: { abbr: "AUD", color: "#BB0A30" },
  cadillac: { abbr: "CAD", color: "#000000" },
}

const memCache = new Map<string, string | null>()

function findTeamKey(name: string) {
  const low = name.toLowerCase()
  for (const k in TEAM_STYLE) if (low.includes(k)) return k
  return null
}

function makeBadgeDataUri(abbr: string, color: string) {
  const textColor = color === "#FFFFFF" || color === "#00D2BE" || color === "#00E701"? "black" : "white"
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" rx="24" fill="${color}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="64" fill="${textColor}">${abbr}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

async function fetchThumb(title: string, size: number): Promise<string | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=${size}&redirects=1&titles=${encodeURIComponent(title)}`
    const res = await fetch(url)
    const data = await res.json()
    const page = Object.values(data?.query?.pages || {})[0] as any
    return page?.thumbnail?.source || null
  } catch { return null }
}

export function useWikiImage(name: string | null | undefined, size = 200) {
  const [url, setUrl] = useState<string | null>(() => {
    if (!name) return null
    const key = findTeamKey(name)
    if (key) return makeBadgeDataUri(TEAM_STYLE[key].abbr, TEAM_STYLE[key].color)
    return memCache.get(`${size}:${name}`) || null
  })

  useEffect(() => {
    if (!name) { setUrl(null); return }
    const teamKey = findTeamKey(name)
    if (teamKey) {
      setUrl(makeBadgeDataUri(TEAM_STYLE[teamKey].abbr, TEAM_STYLE[teamKey].color))
      return
    }

    const cacheKey = `${size}:${name}`
    if (memCache.has(cacheKey)) { setUrl(memCache.get(cacheKey)!); return }

    let active = true
    fetchThumb(name, size).then(async (src) => {
      if (!src) {
        // intenta con (racing driver) para pilotos
        const src2 = await fetchThumb(`${name} (racing driver)`, size)
        if (src2 && active) {
          memCache.set(cacheKey, src2)
          setUrl(src2)
          return
        }
      }
      if (active) {
        memCache.set(cacheKey, src || null)
        setUrl(src)
      }
    })
    return () => { active = false }
  }, [name, size])

  return url
}
