"use client"
import { useEffect, useState } from "react"

const LOGOS: Record<string, string> = {
  ferrari: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Scuderia_Ferrari_Logo.png",
  mclaren: "https://upload.wikimedia.org/wikipedia/commons/0/0b/McLaren_Racing_logo.png",
  redbull: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Red_Bull_Racing_logo_2025.png",
  mercedes: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Mercedes_AMG_Petronas_F1_Team_logo.png",
  aston: "https://upload.wikimedia.org/wikipedia/commons/7/75/Aston_Martin_Aramco_F1_logo.png",
  alpine: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Alpine_F1_Team_Logo.png",
  williams: "https://upload.wikimedia.org/wikipedia/commons/8/85/Williams_Racing_Logo.png",
  rb: "https://upload.wikimedia.org/wikipedia/en/3/32/Visa_Cash_App_RB_Formula_One_Team_logo.png",
  racingbulls: "https://upload.wikimedia.org/wikipedia/en/3/32/Visa_Cash_App_RB_Formula_One_Team_logo.png",
  sauber: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Stake_F1_Team_Kick_Sauber_logo.png",
  kick: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Stake_F1_Team_Kick_Sauber_logo.png",
  haas: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Haas_F1_Team_Logo.png",
}

function findLogo(name: string) {
  const low = name.toLowerCase()
  for (const k in LOGOS) if (low.includes(k)) return LOGOS[k]
  return null
}

async function fetchWikiThumb(title: string, size: number) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=${size}&titles=${encodeURIComponent(title)}`
    const r = await fetch(url)
    const d = await r.json()
    const page = Object.values(d.query.pages)[0] as any
    return page?.thumbnail?.source || null
  } catch { return null }
}

export function useWikiImage(name: string | null | undefined, size = 200) {
  const [url, setUrl] = useState<string | null>(() => findLogo(name || "") || null)

  useEffect(() => {
    if (!name) return
    const logo = findLogo(name)
    if (logo) { setUrl(logo); return }

    fetchWikiThumb(name, size).then(setUrl)
  }, [name, size])

  return url
}
