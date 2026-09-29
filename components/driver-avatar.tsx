"use client"

import { useState } from "react"
import { initials } from "@/lib/f1-utils"
import { useWikiImage } from "@/lib/use-wiki-image"

/**
 * Circular driver avatar. Renders the official headshot when available and
 * falls back to initials on missing/broken images so it never shows a gap.
 * When `wikiTitle` is provided and no explicit `photo` is set, it resolves the
 * driver's Wikipedia lead image (CORS-safe via the MediaWiki action API).
 */
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
  const wikiSrc = useWikiImage(!photo && wikiTitle ? wikiTitle : null, Math.max(200, size * 3))
  const src = photo ?? wikiSrc
  const dim = { width: size, height: size }

  if (src && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src || "/placeholder.svg"}
        alt={name}
        crossOrigin="anonymous"
        loading="lazy"
        onError={() => {
          console.log("[v0] driver photo failed", name, src)
          setErrored(true)
        }}
        className="shrink-0 rounded-full border-2 bg-muted object-cover"
        style={{ ...dim, borderColor: color }}
      />
    )
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 font-mono font-bold text-foreground"
      style={{ ...dim, borderColor: color, fontSize: size * 0.3 }}
    >
      {initials(name)}
    </div>
  )
}
