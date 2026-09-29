"use client"
import type { Constructor, DriverStanding } from "@/lib/types"
import { useFavorites } from "@/components/favorites-provider"
import { DriversPanel } from "@/components/drivers-panel"
import { TeamsPanel } from "@/components/teams-panel"

export function FavoritesPanel({ drivers, teams }: { drivers: DriverStanding[], teams: Constructor[] }) {
  const fav = useFavorites()
  const favDrivers = drivers.filter(d => fav.isDriverFav(d.code))
  const favTeams = teams.filter(t => fav.isTeamFav(t.id))

  if (!favDrivers.length && !favTeams.length) {
    return <p className="text-sm text-muted-foreground">No tienes favoritos aún.</p>
  }

  return (
    <div className="space-y-6">
      {favDrivers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold">Pilotos favoritos</h3>
          <DriversPanel drivers={favDrivers} />
        </div>
      )}
      {favTeams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold">Equipos favoritos</h3>
          <TeamsPanel teams={favTeams} drivers={drivers} />
        </div>
      )}
    </div>
  )
}