"use client"

import { useState } from "react"
import { initials } from "@/lib/f1-utils"

// Fotos oficiales - Wikimedia / F1 - si alguna falla, cae en iniciales
const DRIVER_PHOTOS: Record<string, string> = {
  "Antonelli": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Kimi_Antonelli_2024.jpg",
  "Russell": "https://upload.wikimedia.org/wikipedia/commons/1/19/George_Russell_2022.jpg",
  "Hamilton": "https://upload.wikimedia.org/wikipedia/commons/4/44/Lewis_Hamilton_2022.jpg",
  "Leclerc": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Charles_Leclerc_2024.jpg",
  "Norris": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Lando_Norris_2024.jpg",
  "Piastri": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Oscar_Piastri_2024.jpg",
  "Verstappen": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Max_Verstappen_2024.jpg",
  "Hadjar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Isack_Hadjar_2023.jpg/440px-Isack_Hadjar_2023.jpg",
  "Lawson": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Liam_Lawson_2024.jpg",
  "Lindblad": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Arvid_Lindblad_2024.jpg/440px-Arvid_Lindblad_2024.jpg",
  "Tsunoda": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Yuki_Tsunoda_2024.jpg",
  "Gasly": "https://upload.wikimedia.org/wikipedia/commons/5/58/Pierre_Gasly_2024.jpg",
  "Colapinto": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Franco_Colapinto_2024.jpg",
  "Bearman": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Oliver_Bearman_2024.jpg",
  "Ocon": "https://upload.wikimedia.org/wikipedia/commons/4/48/Esteban_Ocon_2024.jpg",
  "Bortoleto": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gabriel_Bortoleto_2023.jpg",
  "Hülkenberg": "https://upload.wikimedia.org/wikipedia/commons/6/69/Nico_Hulkenberg_2024.jpg",
  "Hulkenberg": "https://upload.wikimedia.org/wikipedia/commons/6/69/Nico_Hulkenberg_2024.jpg",
  "Sainz": "https://upload.wikimedia.org/wikipedia/commons/6/65/Carlos_Sainz_Jr_2024.jpg",
  "Albon": "https://upload.wikimedia.org/wikipedia/commons/7/76/Alex_Albon_2024.jpg",
  "Alonso": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Fernando_Alonso_2024.jpg",
  "Stroll": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Lance_Stroll_2024.jpg",
  "Bottas": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Valtteri_Bottas_2024.jpg",
  "Pérez": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Sergio_Perez_2024.jpg",
  "Perez": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Sergio_Perez_2024.jpg",
}

function getPhotoByName(name: string): string | undefined {
  const lower = name.toLowerCase()
  for (const [key, url] of Object.entries(DRIVER_PHOTOS)) {
    if (lower.includes(key.toLowerCase())) return url
  }
  return undefined
}

export function DriverAvatar({
  name,
  photo,
  wikiTitle,
  color,
  size = 44,
}: {
  name: string
  photo?: string
  wikiTitle?: string | null
  color: string
  size?: number
}) {
  const [errored, setErrored] = useState(false)
  const hardPhoto = getPhotoByName(name)
  const src = photo || hardPhoto
  const dim = { width: size, height: size }

  if (src && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setErrored(true)}
        className="shrink-0 rounded-full border-2 bg-muted object-cover"
        style={{ ...dim, borderColor: color }}
      />
    )
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 font-mono font-bold text-foreground bg-zinc-900"
      style={{ ...dim, borderColor: color, fontSize: size * 0.32 }}
    >
      {initials(name)}
    </div>
  )
}