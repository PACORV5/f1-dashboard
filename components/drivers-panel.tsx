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

function DriverLastResults({ driverId, isDark }: { driverId: string, isDark: boolean }) {
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

  if (loading) return <p className="mt-4 text-xs" style={{ color: isDark? "#a1a1aa" : "#71717a" }}>Cargando resultados 2026...</p>
  if (!results.length) return <p className="mt-4 text-xs" style={{ color: isDark? "#a1a1aa" : "#71717a" }}>Sin resultados 2026</p>

  return (
    <div className="mt-5 border-t pt-4" style={{ borderColor: isDark? "rgba(255,255,255,0.1)" : "#e5e7eb" }}>
      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: isDark? "#fff" : "#18181b" }}>
        Últimas 5 carreras - 2026
      </h4>
      <div className="space-y-2">
        {results.map((r: any) => {
          const res = r.Results[0]
          const pos = res.position
          const isP1 = pos === "1"
          const isDNF = res.status!== "Finished" && isNaN(parseInt(pos))
          return (
            <div key={r.round} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: isDark? "#27272a" : "#f4f4f5" }}>
              <div className="min-w-0 flex-1 pr-2">
                <p className="truncate text-sm font-medium" style={{ color: isDark? "#fff" : "#18181b" }}>{r.raceName}</p>
                <p className="truncate text-[10px]" style={{ color: isDark? "#a1a1aa" : "#71717a" }}>{r.Circuit?.circuitName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isP1? "bg-yellow-500 text-black" : isDNF? "bg-zinc-700 text-zinc-300" : ""}`} style={!isP1 &&!isDNF? { backgroundColor: isDark? "#fff" : "#18181b", color: isDark? "#000" : "#fff" } : {}}>
                  {isDNF? "DNF" : `P${pos}`}
                </span>
                <span className="text-xs" style={{ color: isDark? "#a1a1aa" : "#71717a" }}>+{res.points}</span>
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
  const [isDark, setIsDark] = useState(false)
  const fav = useFavorites()

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  const modalBg = isDark? "#18181b" : "#ffffff"
  const cardBg = isDark? "#27272a" : "#fafafa"
  const border = isDark? "rgba(255,255,255,0.1)" : "#e5e7eb"
  const textMain = isDark? "#ffffff" : "#18181b"
  const textMuted = isDark? "#a1a1aa" : "#71717a"

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {drivers.map((d: any, i: number) => (
          <button key={getDriverId(d) + i} onClick={() => setSelected(d)} className="flex items-center gap-3 rounded-xl border p-3 text-left hover:opacity-80" style={{ backgroundColor: isDark? "#18181b" : "#ffffff", borderColor: border }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold" style={{ borderColor: border, color: textMain }}>{getCode(d).slice(0, 2)}</div>
            <div>
              <p className="text-sm font-semibold" style={{ color: textMain }}>{getName(d)}</p>
              <p className="text-xs" style={{ color: textMuted }}>{getTeam(d)} · P{d.position?? "?"}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-auto rounded-2xl border shadow-2xl" style={{ backgroundColor: modalBg, borderColor: border }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 rounded-full p-1.5" style={{ backgroundColor: cardBg }}><X className="h-4 w-4" style={{ color: textMain }} /></button>

            <div className="p-6" style={{ backgroundColor: isDark? "#27272a" : "#f0f9ff" }}>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white font-bold" style={{ borderColor: isDark? border : "#bae6fd" }}>{getCode(selected).slice(0, 2)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: isDark? "#7dd3fc" : "#0ea5e9" }}>#{getNumber(selected)}</span>
                    <button onClick={() => fav.toggleDriver(getCode(selected))}><Star className={`h-5 w-5 ${fav.isDriverFav(getCode(selected))? "fill-yellow-400 text-yellow-400" : isDark? "text-zinc-600" : "text-zinc-300"}`} /></button>
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: textMain }}>{getName(selected)}</h2>
                  <p className="text-sm" style={{ color: textMuted }}>{getTeam(selected)}</p>
                </div>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: border }} />

            <div className="p-6">
              <div className="mb-4 flex flex-wrap gap-4 text-sm" style={{ color: textMain }}>
                <span>Nacionalidad: <b>{getNationality(selected)}</b></span>
                <span>Código: <b>{getCode(selected)}</b></span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border py-3 text-center" style={{ backgroundColor: cardBg, borderColor: border }}><p className="font-bold" style={{ color: textMain }}>P{selected.position?? "?"}</p><p className="text-[10px] uppercase tracking-widest" style={{ color: textMuted }}>Posición</p></div>
                <div className="rounded-xl border py-3 text-center" style={{ backgroundColor: cardBg, borderColor: border }}><p className="font-bold" style={{ color: textMain }}>{selected.points?? 0}</p><p className="text-[10px] uppercase tracking-widest" style={{ color: textMuted }}>Puntos</p></div>
                <div className="rounded-xl border py-3 text-center" style={{ backgroundColor: cardBg, borderColor: border }}><p className="font-bold" style={{ color: textMain }}>{selected.wins?? 0}</p><p className="text-[10px] uppercase tracking-widest" style={{ color: textMuted }}>Victorias</p></div>
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: textMuted }}>{getName(selected)} compite para {getTeam(selected)} con el número {getNumber(selected)}. P{selected.position?? "?"} con {selected.points?? 0} pts.</p>
              <DriverLastResults driverId={getDriverId(selected)} isDark={isDark} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function DriverCard({ driver, onClick }: { driver: any; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left hover:bg-muted/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold">{getCode(driver).slice(0, 2)}</div>
      <div>
        <p className="text-sm font-semibold">{getName(driver)}</p>
        <p className="text-xs text-muted-foreground">{getTeam(driver)} · P{driver.position?? "?"}</p>
      </div>
    </button>
  )
}