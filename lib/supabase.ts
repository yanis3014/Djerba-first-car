import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SESSION_COOKIE_MAX_AGE_SEC = 60 * 60 * 8; // 8 heures

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      maxAge: SESSION_COOKIE_MAX_AGE_SEC,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        } catch {
          /* Server Components sans réponse mutable : le middleware rafraîchit la session */
        }
      },
    },
  });
}
