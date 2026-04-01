import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isAdminUser } from "@/lib/admin-role";
import { createSupabaseServerClient } from "@/lib/supabase";

export { isAdminUser } from "@/lib/admin-role";

/**
 * Couche 2 — Server : rôle admin explicite (métadonnées Supabase ou liste d’emails).
 * À configurer dans Supabase : app_metadata.role = "admin" ou user_metadata.role = "admin",
 * ou variable ADMIN_EMAILS pour le développement.
 */

export async function getAdminUser(): Promise<User | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) return null;
  return user;
}

export async function requireAdmin(): Promise<User> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    redirect("/admin/login?error=config");
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdminUser(user)) {
    redirect("/admin/login?error=forbidden");
  }

  return user;
}
