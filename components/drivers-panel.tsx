"use client"

import { useEffect, useState } from "react"
import { Star, X } from "lucide-react"
import { useFavorites } from "@/components/favorites-provider"

function getName(d: any) {
  return d.driver?? d.fullName?? d.name?? `${d.Driver?.givenName?? ""} ${d.Driver?.familyName?? ""}`.trim()?? "Driver"
}
function getTeam(d: any) {
  return d.team?? d.teamName?? d.constructorName?? d.Constructors?.[0]?.name?? d.constructor?? "F1 Team"
}
function getCode(d: any) {
  return d.code?? d.Code?? d.abbreviation?? d.Driver?.code?? "DR"
}
function getNumber(d: any) {
  return d.number?? d.permanentNumber?? d.Driver?.permanentNumber?? "?"
}
function getNationality(d: any) {
  return d.nationality?? d.Driver?.nationality?? "N/A"
}
function getDriverId(d: any) {
  return d.driverId?? d.Driver?.driverId?? d.id?? d.code?.toLowerCase()?? "albon"
}

function DriverLastResults({ driverId }: { driverId: string }) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const year = 2026
        const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/results.json`)
        const json = await res.json()
        const races = json.MRData.RaceTable.Races
        setResults(races.reverse().slice(0, 5))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    if (driverId) load()
  }, [driverId])

  if (loading) return <p className="mt-4 text-xs text-muted-foreground">Cargando resultados 2026...</p>
  if (!results.length) return <p className="mt-4 text-xs text-muted-foreground">Sin resultados 2026</p>

  return (
    <div className="mt-5 border-t border-border pt-4">
      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground">
        Últimas 5 carreras - 2026
      </h4>
      <div className="space-y-2">
        {results.map((r: any) => {
          const res = r.Results[0]
          const pos = res.position
          const isP1 = pos === "1"
          const isDNF = res.status!== "Finished" && isNaN(parseInt(pos))
          return (
            <div key={r.round} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
              <div className="min-w-0 flex-1 pr-2">
                <p className="truncate text-sm font-medium">{r.raceName}</p>
                <p className="truncate text-[10px] text-muted-foreground">{r.Circuit?.circuitName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isP1? "bg-yellow-500 text-black" : isDNF? "bg-zinc-200 text-zinc-600" : "bg-foreground text-background"}`}>
                  {isDNF? "DNF" : `P${pos}`}
                </span>
                <span className="text-xs text-muted-foreground">+{res.points}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DriversPanel({ drivers }: { drivers: any[] }) {
  const [selected, setSelected] = useState<any | null>(null)
  const fav = useFavorites()

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {drivers.map((d: any, i: number) => (
          <button key={getDriverId(d) + i} onClick={() => setSelected(d)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:bg-muted/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold">{getCode(d).slice(0, 2)}</div>
            <div>
              <p className="text-sm font-semibold">{getName(d)}</p>
              <p className="text-xs text-muted-foreground">{getTeam(d)} · P{d.position?? "?"}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-auto rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full bg-zinc-100 p-1.5"><X className="h-4 w-4" /></button>
            <div className="bg-gradient-to-br from-sky-50 to-white p-6">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-300 bg-white font-bold">{getCode(selected).slice(0, 2)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-sky-500">#{getNumber(selected)}</span>
                    <button onClick={() => fav.toggleDriver(getCode(selected))}><Star className={`h-5 w-5 ${fav.isDriverFav(getCode(selected))? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}`} /></button>
                  </div>
                  <h2 className="text-xl font-bold">{getName(selected)}</h2>
                  <p className="text-sm text-zinc-500">{getTeam(selected)}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-sky-200" />
            <div className="p-6">
              <div className="mb-4 flex flex-wrap gap-4 text-sm">
                <span>Nacionalidad: <b>{getNationality(selected)}</b></span>
                <span>Código: <b>{getCode(selected)}</b></span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border bg-zinc-50 py-3 text-center"><p className="font-bold">P{selected.position?? "?"}</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Posición</p></div>
                <div className="rounded-xl border bg-zinc-50 py-3 text-center"><p className="font-bold">{selected.points?? 0}</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Puntos</p></div>
                <div className="rounded-xl border bg-zinc-50 py-3 text-center"><p className="font-bold">{selected.wins?? 0}</p><p className="text-[10px] uppercase tracking-widest text-zinc-500">Victorias</p></div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">{getName(selected)} compite para {getTeam(selected)} con el número {getNumber(selected)}. P{selected.position?? "?"} con {selected.points?? 0} pts.</p>
              <DriverLastResults driverId={getDriverId(selected)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function DriverCard({ driver, onClick }: { driver: any; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:bg-muted/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold">{getCode(driver).slice(0, 2)}</div>
      <div>
        <p className="text-sm font-semibold">{getName(driver)}</p>
        <p className="text-xs text-muted-foreground">{getTeam(driver)} · P{driver.position?? "?"}</p>
      </div>
    </button>
  )
}