"use client"

import { useEffect, useRef, useState } from "react"
import { LANGUAGES, useI18n } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-foreground/5"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://flagcdn.com/w40/${current.flag}.png`}
          alt=""
          className="h-3 w-4 rounded-[1px] object-cover"
        />
        <span>{current.code}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-11 z-50 w-40 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/5 ${
                  l.code === lang ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://flagcdn.com/w40/${l.flag}.png`} alt="" className="h-3.5 w-5 rounded-[1px] object-cover" />
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
