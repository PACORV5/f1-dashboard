export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sessions = await fetch("https://api.openf1.org/v1/sessions?session_key=latest").then(r=>r.json())
    const s = sessions[0]
    if(!s) throw new Error("No live session")

    const key = s.session_key
    const dateFilter = new Date(Date.now() - 25000).toISOString()

    const [cars, locs, drivers, track] = await Promise.all([
      fetch(`https://api.openf1.org/v1/car_data?session_key=${key}&date>${dateFilter}`).then(r=>r.json()).catch(()=>[]),
      fetch(`https://api.openf1.org/v1/location?session_key=${key}&date>${dateFilter}`).then(r=>r.json()).catch(()=>[]),
      fetch(`https://api.openf1.org/v1/drivers?session_key=${key}`).then(r=>r.json()).catch(()=>[]),
      // Pista: la bajamos completa una vez para que se vea bien Bakú
      fetch(`https://api.openf1.org/v1/location?session_key=${key}&driver_number=1`).then(r=>r.json()).then(d=>d.filter((_:any,i:number)=>i%3===0).slice(0,2500)).catch(()=>[])
    ])

    const lastCars: any = {}
    cars.forEach((c:any)=> lastCars[c.driver_number]=c)
    const lastLocs: any = {}
    locs.forEach((l:any)=> lastLocs[l.driver_number]=l)

    return Response.json({
      meeting: `${s.location} - ${s.session_name} - ${s.country_name}`,
      session_key: key,
      track,
      cars: Object.values(lastCars),
      positions: Object.values(lastLocs),
      drivers
    })
  } catch (e:any) {
    return Response.json({ meeting:"No live", track:[], cars:[], positions:[], drivers:[], error:e.message })
  }
}