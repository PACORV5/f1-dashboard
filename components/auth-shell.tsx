import Link from "next/link"
import type { ReactNode } from "react"

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-9 items-center rounded-sm bg-f1-red px-2.5">
            <span className="font-mono text-lg font-bold italic tracking-tighter text-white">F1</span>
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">LIVE</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-lg font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  )
}

export const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-f1-red"

export const primaryButtonClass =
  "flex w-full items-center justify-center rounded-lg bg-f1-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-f1-red/90 disabled:cursor-not-allowed disabled:opacity-60"

export const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
