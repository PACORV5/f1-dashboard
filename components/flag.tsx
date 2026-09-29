import { countryFlagUrl, flagUrl } from "@/lib/f1-media"

/**
 * Small flag image. Pass either a `nationality` demonym (e.g. "British") or a
 * `country` name (e.g. "United Kingdom"). Renders nothing when unmapped so it
 * degrades gracefully.
 */
export function Flag({
  nationality,
  country,
  className = "h-3 w-4 rounded-[1px] object-cover",
}: {
  nationality?: string | null
  country?: string | null
  className?: string
}) {
  const url = country ? countryFlagUrl(country) : flagUrl(nationality)
  const label = country ?? nationality ?? ""
  if (!url) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url || "/placeholder.svg"} alt={label ? `${label} flag` : ""} className={className} loading="lazy" />
  )
}
