"use client"

import { useState } from "react"
import { initials } from "@/lib/f1-utils"

const TEAM_LOGOS: Record<string, string> = {
  Mercedes: "https://upload.wikimedia.org/wikipedia/commons/3/32/Mercedes_AMG_Petronas_F1_logo.svg",
  Ferrari: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg",
  McLaren: "https://upload.wikimedia.org/wikipedia/commons/a/a5/McLaren_Racing_logo.svg",
  "Red Bull": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Red_Bull_Racing_logo.svg",
  "Red Bull Racing": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Red_Bull_Racing_logo.svg",
  "RB F1 Team": "https://upload.wikimedia.org/wikipedia/commons/7/7e/RB_Formula_One_Team_logo.svg",
  "Racing Bulls": "https://upload.wikimedia.org/wikipedia/commons/7/7e/RB_Formula_One_Team_logo.svg",
  Alpine: "https://upload.wikimedia.org/wikipedia/commons/9/99/Alpine_F1_Team_logo.svg",
  "Alpine F1 Team": "https://upload.wikimedia.org/wikipedia/commons/9/99/Alpine_F1_Team_logo.svg",
  Haas: "https://upload.wikimedia.org/wikipedia/commons/4/49/Haas_F1_Team_logo.svg",
  "Haas F1 Team": "https://upload.wikimedia.org/wikipedia/commons/4/49/Haas_F1_Team_logo.svg",
  Audi: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Audi_logo.svg",
  Williams: "https://upload.wikimedia.org/wikipedia/commons/1/15/Williams_Racing_logo.svg",
  "Aston Martin": "https://upload.wikimedia.org/wikipedia/commons/4/49/Aston_Martin_F1_logo.svg",
  Cadillac: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Cadillac_logo.svg",
  "Cadillac F1 Team": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Cadillac_logo.svg",
}

export function TeamLogo({
  title,
  name,
  color,
  size = 40,
}: {
  title: string
  name: string
  color: string
  size?: number
}) {
  const [errored, setErrored] = useState(false)
  // busca por nombre, si no lo encuentra usa el src de wikipedia como respaldo
  const hardLogo = TEAM_LOGOS[name] || TEAM_LOGOS[title] || Object.entries(TEAM_LOGOS).find(([k]) => name.toLowerCase().includes(k.toLowerCase()))?.[1]
  const dim = { width: size, height: size }

  if (hardLogo &&!errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={hardLogo}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setErrored(true)}
        className="shrink-0 rounded-lg border border-border bg-white object-contain p-1"
        style={dim}
      />
    )
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg border-2 font-mono text-xs font-bold text-foreground"
      style={{...dim, borderColor: color }}
    >
      {initials(name)}
    </div>
  )
}