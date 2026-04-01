"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Lead } from "@/lib/types";

export async function markMessageAsRead(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("messages").update({ is_read: true }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/messages");
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  await requireAdmin();
  const allowed: Lead["status"][] = ["new", "contacted", "closed"];
  if (!allowed.includes(status)) {
    throw new Error("Statut invalide");
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/leads");
}
