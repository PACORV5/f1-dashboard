import { createBrowserClient } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** True only when both public Supabase env vars are present at build/runtime. */
export const isSupabaseConfigured = Boolean(url && anonKey)

let client: ReturnType<typeof createBrowserClient> | undefined

/**
 * Singleton browser Supabase client (safe to call from any client component).
 * Returns null when env vars are missing so callers can degrade gracefully
 * instead of throwing and blanking the page.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null
  if (client) return client
  client = createBrowserClient(url!, anonKey!)
  return client
}
