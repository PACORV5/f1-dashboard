"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthShell, inputClass, labelClass, primaryButtonClass } from "@/components/auth-shell"
import { useI18n } from "@/lib/i18n"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(params.get("error"))
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    if (!supabase) {
      setError(t("login.err.invalid"))
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes("not confirmed")) {
        setError(t("login.err.notConfirmed"))
      } else if (msg.includes("rate")) {
        setError(t("login.err.rate"))
      } else {
        setError(t("login.err.invalid"))
      }
      setLoading(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <div className="relative">
      {/* BOTÓN REGRESAR */}
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
        aria-label="Regresar"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <AuthShell
        title={t("login.title")}
        subtitle={t("login.subtitle")}
        footer={
          <>
            {t("login.noAccount")}{" "}
            <Link href="/signup" className="font-semibold text-f1-red hover:underline">
              {t("login.signupLink")}
            </Link>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder={t("auth.emailPlaceholder")}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className={labelClass + " mb-0"}>
                {t("auth.password")}
              </label>
              <Link href="/forgot-password" className="text-[11px] font-medium text-f1-red hover:underline">
                {t("login.forgotShort")}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-f1-red">{error}</p>}

          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading? t("login.submitting") : t("login.submit")}
          </button>
        </form>


      </AuthShell>
    </div>
  )
}