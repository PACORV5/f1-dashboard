"use client"

import { useEffect, useState } from "react"

/**
 * Resolves a Wikipedia article's lead image (driver headshot / team logo) via
 * the MediaWiki action API, which is CORS-enabled through `origin=*` so it
 * works directly from the browser. Results are cached in-memory and in
 * localStorage so each title is only fetched once per size.
 */
const memCache = new Map<string, string | null>()
const inflight = new Map<string, Promise<string | null>>()

function lsKey(title: string, size: number) {
  return `wikiimg:${size}:${title}`
}

async function resolve(title: string, size: number): Promise<string | null> {
  const key = `${size}:${title}`
  if (memCache.has(key)) return memCache.get(key) ?? null

  if (typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem(lsKey(title, size))
      if (cached !== null) {
        const val = cached === "" ? null : cached
        memCache.set(key, val)
        return val
      }
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }

  if (inflight.has(key)) return inflight.get(key)!

  const p = (async () => {
    try {
      const url =
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
        `&prop=pageimages&piprop=thumbnail&pithumbsize=${size}&redirects=1` +
        `&titles=${encodeURIComponent(title)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const pages = data?.query?.pages ?? {}
      const first = Object.values(pages)[0] as { thumbnail?: { source?: string } } | undefined
      const src = first?.thumbnail?.source ?? null
      memCache.set(key, src)
      try {
        window.localStorage.setItem(lsKey(title, size), src ?? "")
      } catch {
        // ignore storage errors
      }
      if (!src) console.log("[v0] wiki image: no thumbnail for", title)
      return src
    } catch (e) {
      console.log("[v0] wiki image failed for", title, e instanceof Error ? e.message : e)
      memCache.set(key, null)
      return null
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, p)
  return p
}

export function useWikiImage(title: string | null | undefined, size = 200): string | null {
  const [src, setSrc] = useState<string | null>(() => (title ? (memCache.get(`${size}:${title}`) ?? null) : null))

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
