"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

type FavoritesContextValue = {
  /** Favorited driver 3-letter codes, e.g. ["VER", "LEC"]. */
  drivers: string[]
  /** Favorited constructor ids. */
  teams: string[]
  toggleDriver: (code: string) => void
  toggleTeam: (id: string) => void
  isDriverFav: (code: string) => boolean
  isTeamFav: (id: string) => boolean
  ready: boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [drivers, setDrivers] = useState<string[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  // Load the signed-in user's favorites from Supabase; clear on sign-out.
  useEffect(() => {
    let cancelled = false

    if (!user) {
      setDrivers([])
      setTeams([])
      setReady(true)
      return
    }

    setReady(false)
    const supabase = createClient()
    if (!supabase) {
      setReady(true)
      return
    }
    supabase
      .from("favorites")
      .select("item_type, driver_code")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return
        const d: string[] = []
        const t: string[] = []
        for (const row of data ?? []) {
          if (row.item_type === "team") t.push(row.driver_code)
          else d.push(row.driver_code)
        }
        setDrivers(d)
        setTeams(t)
        setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const toggleDriver = useCallback(
    (code: string) => {
      if (!user) return
      const has = drivers.includes(code)
      setDrivers((prev) => (has ? prev.filter((c) => c !== code) : [...prev, code]))
      const supabase = createClient()
      if (has) {
        void supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_type", "driver")
          .eq("driver_code", code)
      } else {
        void supabase.from("favorites").insert({ user_id: user.id, item_type: "driver", driver_code: code })
      }
    },
    [user, drivers],
  )

  const toggleTeam = useCallback(
    (id: string) => {
      if (!user) return
      const has = teams.includes(id)
      setTeams((prev) => (has ? prev.filter((c) => c !== id) : [...prev, id]))
      const supabase = createClient()
      if (has) {
        void supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_type", "team")
          .eq("driver_code", id)
      } else {
        void supabase.from("favorites").insert({ user_id: user.id, item_type: "team", driver_code: id })
      }
    },
    [user, teams],
  )

  const isDriverFav = useCallback((code: string) => drivers.includes(code), [drivers])
  const isTeamFav = useCallback((id: string) => teams.includes(id), [teams])

  return (
    <FavoritesContext.Provider value={{ drivers, teams, toggleDriver, toggleTeam, isDriverFav, isTeamFav, ready }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider")
  return ctx
}
