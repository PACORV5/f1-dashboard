"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AuthShell, inputClass, labelClass, primaryButtonClass } from "@/components/auth-shell"
import { useI18n } from "@/lib/i18n"

export default function ResetPasswordPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError(t("reset.passwordMin"))
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(t("reset.err"))
      setLoading(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <AuthShell title={t("reset.title")} subtitle={t("reset.subtitle")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className={labelClass}>
            {t("reset.newPassword")}
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
          {loading ? t("reset.submitting") : t("reset.submit")}
        </button>
      </form>
    </AuthShell>
  )
}
