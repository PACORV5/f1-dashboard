import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the service-role key. It bypasses RLS and
 * must never be imported into client components. Used to populate the public
 * read-only cache tables (race_results, circuits).
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
