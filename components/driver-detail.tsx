"use client"
import { useEffect, useState } from "react"

export function DriverDetail({ driver }: Props) {
  const [realRaces, setRealRaces] = useState(driver.races || driver.lastRaces || [])

  useEffect(() => {
    if (realRaces.length > 0) return
    const code = driver.code || driver.acronym
    // Ergast 2026 - ejemplo
    fetch(`https://api.jolpi.ca/ergast/f1/2026/drivers/${driver.driverId || code}/results.json`)
     .then(r => r.json())
     .then(data => {
        const races = data?.MRData?.RaceTable?.Races?.slice(-5).reverse().map((r:any) => ({
          name: r.raceName,
          circuit: r.Circuit?.circuitName,
          position: r.Results?.[0]?.position,
          points: r.Results?.[0]?.points,
        })) || []
        setRealRaces(races)
      })
     .catch(() => setRealRaces([]))
  }, [driver])

  //... y usa realRaces en vez de races
}