"use client"

import { useState } from "react"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthShell, inputClass, labelClass, primaryButtonClass } from "@/components/auth-shell"
import { useI18n } from "@/lib/i18n"

function resetRedirect() {
  const base = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`
  try {
    const url = new URL(base)
    url.searchParams.set("next", "/reset-password")
    return url.toString()
  } catch {
    return base
  }
}

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: resetRedirect() })
    if (error) {
      setError(t("forgot.err"))
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  const sentParts = t("forgot.sentBody").split("{email}")

  return (
    <AuthShell
      title={t("forgot.title")}
      subtitle={t("forgot.subtitle")}
      footer={
        <Link href="/login" className="font-semibold text-f1-red hover:underline">
          {t("forgot.backToSignin")}
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background px-4 py-6 text-center">
          <MailCheck className="h-8 w-8 text-f1-red" />
          <p className="text-sm text-muted-foreground">
            {sentParts[0]}
            <span className="font-semibold text-foreground">{email}</span>
            {sentParts[1]}
          </p>
        </div>
      ) : (
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

          {error && <p className="text-sm text-f1-red">{error}</p>}

          <button type="submit" disabled={loading} className={primaryButtonClass}>
            {loading ? t("forgot.submitting") : t("forgot.submit")}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
