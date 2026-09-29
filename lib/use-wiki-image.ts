"use client"

import { useEffect, useState } from "react"

const memCache = new Map<string, string | null>()
const inflight = new Map<string, Promise<string | null>>()

function lsKey(title: string, size: number) {
  return `wikiimg:${size}:${title}`
}

// Mapa de correcciones - nombres que en Wikipedia son diferentes
const TITLE_FIXES: Record<string, string> = {
  "Ferrari": "Scuderia Ferrari",
  "McLaren": "McLaren",
  "Red Bull": "Red Bull Racing",
  "Red Bull Racing": "Red Bull Racing",
  "Mercedes": "Mercedes-Benz in Formula One",
  "Aston Martin": "Aston Martin in Formula One",
  "Alpine F1 Team": "Alpine F1 Team",
  "Williams": "Williams Grand Prix Engineering",
  "RB F1 Team": "RB Formula One Team",
  "Racing Bulls": "RB Formula One Team",
  "RB": "RB Formula One Team",
  "Kick Sauber": "Sauber",
  "Sauber": "Sauber",
  "Haas F1 Team": "Haas F1 Team",
  "Haas": "Haas F1 Team",
  "Audi": "Audi in Formula One",
  "Cadillac F1 Team": "Cadillac in Formula One",
}

async function fetchThumb(title: string, size: number): Promise<string | null> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&prop=pageimages&piprop=thumbnail&pithumbsize=${size}&redirects=1` +
      `&titles=${encodeURIComponent(title)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const pages = data?.query?.pages?? {}
    const first = Object.values(pages)[0] as any
    if (first?.missing) return null
    return first?.thumbnail?.source?? null
  } catch {
    return null
  }
}

async function searchTitle(query: string): Promise<string | null> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const hit = data?.query?.search?.[0]
    return hit?.title?? null
  } catch {
    return null
  }
}

async function resolve(title: string, size: number): Promise<string | null> {
  const key = `${size}:${title}`
  if (memCache.has(key)) return memCache.get(key)?? null

  if (typeof window!== "undefined") {
    try {
      const cached = window.localStorage.getItem(lsKey(title, size))
      if (cached!== null) {
        const val = cached === ""? null : cached
        memCache.set(key, val)
        return val
      }
    } catch {}
  }

  if (inflight.has(key)) return inflight.get(key)!

  const p = (async () => {
    const fixedTitle = TITLE_FIXES[title] || title

    // 1. Intenta directo
    let src = await fetchThumb(fixedTitle, size)

    // 2. Si falla, busca en Wikipedia
    if (!src) {
      const searched = await searchTitle(fixedTitle)
      if (searched && searched!== fixedTitle) {
        src = await fetchThumb(searched, size)
      }
    }

    // 3. Si sigue fallando, intenta con " (racing driver)" para pilotos
    if (!src &&!fixedTitle.toLowerCase().includes("formula") &&!fixedTitle.toLowerCase().includes("scuderia")) {
      src = await fetchThumb(`${fixedTitle} (racing driver)`, size)
    }

    memCache.set(key, src)
    try {
      window.localStorage.setItem(lsKey(title, size), src?? "")
    } catch {}

    if (!src) console.log("[v0] wiki image: no thumbnail for", title, "tried", fixedTitle)
    return src
  })()

  inflight.set(key, p)
  const result = await p
  inflight.delete(key)
  return result
}

export function useWikiImage(title: string | null | undefined, size = 200): string | null {
  const [src, setSrc] = useState<string | null>(() => (title? (memCache.get(`${size}:${title}`)?? null) : null))

  useEffect(() => {
    let active = true
    if (!title) {
      setSrc(null)
      return
    }
    resolve(title, size).then((s) => {
      if (active) setSrc(s)
    })
    return () => {
      active = false
    }
  }, [title, size])

  return src
}
