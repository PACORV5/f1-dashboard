"use client"

import type { LiveSession, RaceNotification } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsBell } from "@/components/notifications-bell"
import { UserMenu } from "@/components/user-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n"

export function F1Header({
  session,
  isLive,
  notifications,
  onClearNotifications,
  hasFavorites,
}: {
  session: LiveSession | null
  isLive: boolean
  notifications: RaceNotification[]
  onClearNotifications: () => void
  hasFavorites: boolean
}) {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 items-center rounded-sm bg-f1-red px-2.5">
            <span className="font-mono text-lg font-bold italic tracking-tighter text-white">F1</span>
          </div>
          <div className="leading-none">
            <span className="text-xl font-bold tracking-tight text-foreground">LIVE</span>
            <p className="mt-1 hidden text-[11px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
              {t("ESTADISTICAS Y RESULTADOS")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLive && session ? (
            <div className="flex items-center gap-2 rounded-full border border-f1-red/40 bg-f1-red/10 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-f1-red opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-f1-red" />
              </span>
              <span className="max-w-[10rem] truncate text-xs font-semibold uppercase tracking-wide text-foreground">
                {session.location} {session.sessionName}
              </span>
            </div>
          ) : (
            <div className="hidden rounded-full border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:block">
              {t("LIVE OFF")}
            </div>
          )}

          <NotificationsBell items={notifications} onClear={onClearNotifications} hasFavorites={hasFavorites} />
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
