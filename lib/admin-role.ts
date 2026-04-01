import type { User } from "@supabase/supabase-js";

/** Utilisable dans middleware (Edge) et Server Components — pas d’import Next/Supabase client. */
export function isAdminUser(user: User): boolean {
  if (user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin") {
    return true;
  }
  const allowList =
    process.env.ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? [];
  return Boolean(user.email && allowList.includes(user.email.toLowerCase()));
}
