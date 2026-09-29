"use client"

import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFavorites } from "@/components/favorites-provider"
import { useAuth } from "@/components/auth-provider"

export function FavButton({
  kind,
  id,
  size = "sm",
}: {
  kind: "driver" | "team"
  /** Driver 3-letter code for drivers, constructor id for teams. */
  id: string
  size?: "sm" | "lg"
}) {
  const fav = useFavorites()
  const { user } = useAuth()
  const router = useRouter()
  const active = kind === "driver" ? fav.isDriverFav(id) : fav.isTeamFav(id)
  const dim = size === "lg" ? "h-5 w-5" : "h-4 w-4"

  const handle = () => {
    if (!user) {
      router.push("/login")
      return
    }
    if (kind === "driver") fav.toggleDriver(id)
    else fav.toggleTeam(id)
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        handle()
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={`flex shrink-0 items-center justify-center rounded-full p-1.5 transition-colors ${
        active ? "text-f1-gold" : "text-foreground/35 hover:text-foreground/80"
      }`}
    >
      <Star className={`${dim} ${active ? "fill-current" : ""}`} />
    </button>
  )
}
