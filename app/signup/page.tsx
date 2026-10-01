"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MailCheck, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthShell, inputClass, labelClass, primaryButtonClass } from "@/components/auth-shell"
import { useI18n } from "@/lib/i18n"

function authRedirect() {
  return process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL?? `${window.location.origin}/auth/callback`
}

export default function SignUpPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError(t("signup.passwordMin"))
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: authRedirect() },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes("already") || msg.includes("registered")) {
        setError(t("signup.err.exists"))
      } else if (msg.includes("password")) {
        setError(error.message)
      } else {
        setError(t("signup.err.generic"))
      }
      setLoading(false)
      return
    }
    if (data.session) {
      router.push("/")
      router.refresh()
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    const parts = t("signup.sentBody").split("{email}")
    return (
      <div className="relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Regresar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <AuthShell
          title={t("signup.sentTitle")}
          subtitle={t("signup.sentSubtitle")}
          footer={
            <Link href="/login" className="font-semibold text-f1-red hover:underline">
              {t("signup.backToSignin")}
            </Link>
          }
        >
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background px-4 py-6 text-center">
            <MailCheck className="h-8 w-8 text-f1-red" />
            <p className="text-sm text-muted-foreground">
              {parts[0]}
              <span className="font-semibold text-foreground">{email}</span>
              {parts[1]}
            </p>
          </div>
        </AuthShell>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
        aria-label="Regresar"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <AuthShell
        title={t("signup.title")}
        subtitle={t("signup.subtitle")}
        footer={
          <>
            {t("signup.haveAccount")}{" "}
            <Link href="/login" className="font-semibold text-f1-red hover:underline">
              {t("signup.signinLink")}
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
            <label htmlFor="password" className={labelClass}>
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder={t("signup.passwordPlaceholder")}
            />
          </div>

          {error && <p className="text-sm text-f1-red">{error}</p>}

          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading? t("signup.submitting") : t("signup.submit")}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{t("auth.or")}</span>
          <span className="h-px flex-1 bg-border" />
        </div>

      </AuthShell>
    </div>
  )
}