"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, User as UserIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function UserMenu() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-foreground/10" aria-hidden />
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-f1-red px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-f1-red/90"
      >
        Sign in
      </Link>
    )
  }

  const email = user.email ?? "Account"
  const initial = email.charAt(0).toUpperCase()

  const handleLogout = async () => {
    setOpen(false)
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-bold text-foreground transition-colors hover:border-foreground/30"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
              <p className="truncate text-sm font-semibold text-foreground">{email}</p>
            </div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-f1-red/10 hover:text-f1-red"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
