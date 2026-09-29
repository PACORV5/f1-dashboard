import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

// Next.js 16 renamed root `middleware.ts` to `proxy.ts`. Using the old name
// with Turbopack surfaces "Cannot find the middleware module" and 404s the
// whole app into a blank screen, so this must stay named `proxy`.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
