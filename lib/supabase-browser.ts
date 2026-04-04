import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const SESSION_COOKIE_MAX_AGE_SEC = 60 * 60 * 8; // 8 heures

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      maxAge: SESSION_COOKIE_MAX_AGE_SEC,
    },
  });
}
