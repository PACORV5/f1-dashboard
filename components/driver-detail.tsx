"use client"

import { FavButton } from "@/components/fav-button"

export function DriverDetail({ driver }: { driver: any }) {
  if (!driver) return null

  const initials = `${driver.givenName?.[0] || ""}${driver.familyName?.[0] || ""}`.toUpperCase() || driver.code?.slice(0,2) || "AN"
  const last5 = driver.last5 || driver.recentRaces || driver.results?.slice(-5).reverse() || driver.races?.slice(-5).reverse() || []
  const year = new Date().getFullYear()

  const getPosStyle = (pos: any) => {
    const p = String(pos).replace("P","")
    if (p === "1") return "bg-[#FACC15] text-black"
    return "bg-white text-black"
  }

  return (
    <div className="space-y-0 overflow-hidden rounded-[20px]">
      {/* Header */}
      <div className="flex items-start gap-4 bg-[#2A2A2A] p-5">
        <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#2A2A2A] text-[20px]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[16px] font-bold text-[#60A5FA]">#{driver.number}</span>
            <FavButton kind="driver" id={driver.id} />
          </div>
          <h2 className="text-[22px] font-bold leading-tight text-white">
            {driver.givenName} {driver.familyName}
          </h2>
          <p className="text-[15px] text-white/60">{driver.teamName}</p>
        </div>
      </div>

      <div className="bg-[#1E1E1E] p-5 space-y-5">
        {/* Nacionalidad / Código */}
        <div className="flex gap-6 text-[15px] text-white/80">
          <span>Nacionalidad: <b className="text-white font-bold">{driver.nationality}</b></span>
          <span>Código: <b className="text-white font-bold">{driver.code}</b></span>
        </div>

        {/* Stats 3 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[16px] border border-white/10 bg-[#2A2A2A] py-4 text-center">
            <p className="font-mono text-[22px] font-bold text-white">P{driver.position}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-white/40">Posición</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-[#2A2A2A] py-4 text-center">
            <p className="font-mono text-[22px] font-bold text-white">{driver.points}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-white/40">Puntos</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-[#2A2A2A] py-4 text-center">
            <p className="font-mono text-[22px] font-bold text-white">{driver.wins?? 0}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-white/40">Victorias</p>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-[15px] leading-snug text-white/50">
          {driver.givenName} {driver.familyName} compite para {driver.teamName} con el número {driver.number}. P{driver.position} con {driver.points} pts.
        </p>

        <div className="h-px bg-white/10" />

        {/* Últimas 5 */}
        <div>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-widest text-white">
            Últimas 5 carreras - {year}
          </h3>
          <div className="space-y-2.5">
            {last5.length > 0? last5.map((r: any, i: number) => {
              const pos = r.position || r.finishPosition || r.pos || "-"
              const pts = r.points?? r.pts?? 0
              const raceName = r.raceName || r.name || r.GrandPrix
              const circuit = r.circuit || r.circuitName || r.location || ""
              return (
                <div key={i} className="flex items-center justify-between rounded-[14px] bg-[#2A2A2A] px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-white">{raceName}</p>
                    <p className="truncate text-[13px] text-white/40">{circuit}</p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-3 py-1 font-mono text-[13px] font-bold ${getPosStyle(pos)}`}>
                      P{String(pos).replace("P","")}
                    </span>
                    <span className="font-mono text-[14px] text-white/40">+{pts}</span>
                  </div>
                </div>
              )
            }) : (
              <p className="rounded-[14px] bg-[#2A2A2A] p-4 text-center text-sm text-white/40">
                No hay datos de last5 en el driver. Asegúrate que en lib/f1-hooks le pasas recentRaces
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}