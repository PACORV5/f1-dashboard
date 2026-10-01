"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export function Modal({
  open,
  onClose,
  label,
  children
}: {
  open: boolean
  onClose: () => void
  label: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onEsc)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onEsc)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open ||!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-xl border border-border bg-background p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
          <button
            onClick={onClose}
            className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-bold hover:bg-foreground/15"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}