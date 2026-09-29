"use client"

import { useEffect, useRef, useState } from "react"
import type { LeaderboardRow, RaceNotification } from "@/lib/types"
import { tyreName } from "@/lib/f1-utils"

type Snapshot = { position: number; tyre?: string; retired: boolean }

let counter = 0
function make(color: string, kind: RaceNotification["kind"], message: string): RaceNotification {
  counter += 1
  return { id: `${Date.now()}-${counter}`, color, kind, message, ts: Date.now() }
}

/**
 * Derives personalized notifications from live timing updates for the user's
 * favorited drivers and teams. Only diffs between consecutive polls produce
 * notifications, so identical refreshes never spam the feed. Favorites are
 * matched to live rows by driver code and team name.
 */
export function useRaceNotifications(rows: LeaderboardRow[], favDriverCodes: string[], favTeamNames: string[]) {
  const [items, setItems] = useState<RaceNotification[]>([])
  const prev = useRef<Map<number, Snapshot>>(new Map())
  const seeded = useRef(false)

  useEffect(() => {
    if (rows.length === 0) return

    const favD = new Set(favDriverCodes.map((c) => c.toUpperCase()))
    const favT = new Set(favTeamNames.map((t) => t.toLowerCase()))
    const next = new Map<number, Snapshot>()
    const fresh: RaceNotification[] = []

    for (const r of rows) {
      const retired = r.gap === "OUT" || r.gap === "DNF"
      next.set(r.driverNumber, { position: r.position, tyre: r.tyre, retired })

      const isFav = favD.has(r.code.toUpperCase()) || favT.has(r.teamName.toLowerCase())
      if (!isFav) continue

      const before = prev.current.get(r.driverNumber)
      if (!before) continue

      const color = r.teamColor
      if (!before.retired && retired) {
        fresh.push(make(color, "dnf", `${r.name} is OUT of the session`))
      } else if (before.position !== r.position) {
        const dir = r.position < before.position ? "climbs to" : "drops to"
        fresh.push(make(color, "position", `${r.name} ${dir} P${r.position}`))
      } else if (before.tyre !== r.tyre && r.tyre) {
        fresh.push(make(color, "tyre", `${r.name} pits — now on ${tyreName(r.tyre)} tyres`))
      }
    }

    prev.current = next
    if (!seeded.current) {
      seeded.current = true
      return
    }
    if (fresh.length) setItems((p) => [...fresh, ...p].slice(0, 40))
  }, [rows, favDriverCodes, favTeamNames])

  return { items, clear: () => setItems([]) }
}
