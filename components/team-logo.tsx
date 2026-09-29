"use client"

import { useState } from "react"
import { initials } from "@/lib/f1-utils"
import { useWikiImage } from "@/lib/use-wiki-image"

/**
 * Team crest/logo. Resolves the constructor's Wikipedia lead image (usually the
 * team logo) and falls back to a colored initials tile if it is missing or the
 * image fails to load, so it never renders an empty box.
 */
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
  const src = useWikiImage(title, Math.max(160, size * 3))
  const dim = { width: size, height: size }

  if (src && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src || "/placeholder.svg"}
        alt={`${name} logo`}
        crossOrigin="anonymous"
        loading="lazy"
        onError={() => {
          console.log("[v0] team logo failed", name, src)
          setErrored(true)
        }}
        className="shrink-0 rounded-lg border border-border bg-white object-contain p-1"
        style={dim}
      />
    )
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg border-2 font-mono text-xs font-bold text-foreground"
      style={{ ...dim, borderColor: color }}
    >
      {initials(name)}
    </div>
  )
}
