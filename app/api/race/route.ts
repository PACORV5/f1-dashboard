import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const JOLPI = "https://api.jolpi.ca/ergast/f1"
const FRESH_MS = 6 * 60 * 60 * 1000 // re-fetch cached rounds at most every 6h

interface QualiRow {
  position: number
  code: string
  driverName: string
  teamName: string
  teamColor: string
  q1?: string
  q2?: string
  q3?: string
}

async function jolpi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPI}/${path}`, { cache: "no-store" })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

function mapResults(results: any[]) {
  return results.map((res: any) => ({
    position: Number(res.position),
    points: Number(res.points),
    number: res.number,
    code: res.Driver.code ?? res.Driver.familyName.slice(0, 3).toUpperCase(),
    driverName: `${res.Driver.givenName} ${res.Driver.familyName}`,
    nationality: res.Driver.nationality,
    teamId: res.Constructor.constructorId,
    teamName: res.Constructor.name,
    grid: Number(res.grid),
    laps: Number(res.laps),
    status: res.status,
    time: res.Time?.time,
    fastestLap: res.FastestLap?.Time?.time,
  }))
}

function mapQualifying(results: any[]): QualiRow[] {
  return results.map((q: any) => ({
    position: Number(q.position),
    code: q.Driver.code ?? q.Driver.familyName.slice(0, 3).toUpperCase(),
    driverName: `${q.Driver.givenName} ${q.Driver.familyName}`,
    nationality: q.Driver.nationality,
    teamId: q.Constructor.constructorId,
    teamName: q.Constructor.name,
    q1: q.Q1,
    q2: q.Q2,
    q3: q.Q3,
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const season = searchParams.get("season") ?? "2026"
  const round = Number(searchParams.get("round"))
  if (!round || Number.isNaN(round)) {
    return NextResponse.json({ error: "round is required" }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Serve from cache when fresh.
  if (supabase) {
    const { data: cached } = await supabase
      .from("race_results")
      .select("results, qualifying, race_name, circuit_id, updated_at")
      .eq("season", season)
      .eq("round", round)
      .maybeSingle()

    if (cached && Date.now() - new Date(cached.updated_at).getTime() < FRESH_MS) {
      const { data: circuitRow } = cached.circuit_id
        ? await supabase.from("circuits").select("data").eq("circuit_id", cached.circuit_id).maybeSingle()
        : { data: null }
      return NextResponse.json({
        raceName: cached.race_name,
        results: cached.results ?? [],
        qualifying: cached.qualifying ?? [],
        circuit: circuitRow?.data ?? null,
        cached: true,
      })
    }
  }

  // 2. Fetch fresh from Jolpica.
  const [resultsJson, qualiJson] = await Promise.all([
    jolpi<any>(`${season}/${round}/results.json`),
    jolpi<any>(`${season}/${round}/qualifying.json`),
  ])

  const raceObj = resultsJson?.MRData?.RaceTable?.Races?.[0] ?? qualiJson?.MRData?.RaceTable?.Races?.[0]
  if (!raceObj) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  const circuit = raceObj.Circuit
    ? {
        circuitId: raceObj.Circuit.circuitId,
        circuitName: raceObj.Circuit.circuitName,
        locality: raceObj.Circuit.Location?.locality,
        country: raceObj.Circuit.Location?.country,
        lat: raceObj.Circuit.Location?.lat,
        long: raceObj.Circuit.Location?.long,
        url: raceObj.Circuit.url,
      }
    : null

  const results = mapResults(raceObj.Results ?? resultsJson?.MRData?.RaceTable?.Races?.[0]?.Results ?? [])
  const qualifying = mapQualifying(qualiJson?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults ?? [])
  const raceName = raceObj.raceName

  // 3. Persist to cache (best-effort; ignore failures).
  if (supabase) {
    if (circuit) {
      await supabase.from("circuits").upsert({ circuit_id: circuit.circuitId, data: circuit, updated_at: new Date().toISOString() })
    }
    await supabase.from("race_results").upsert(
      {
        season,
        round,
        race_name: raceName,
        circuit_id: circuit?.circuitId ?? null,
        results,
        qualifying,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "season,round" },
    )
  }

  return NextResponse.json({ raceName, results, qualifying, circuit, cached: false })
}
