"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Lead } from "@/lib/types";

const leadIdsSchema = z.array(z.string().uuid()).min(1).max(100);

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

export async function bulkMarkLeadsAsTreated(ids: string[]) {
  await requireAdmin();
  const parsed = leadIdsSchema.safeParse(ids);
  if (!parsed.success) {
    throw new Error("Sélection de leads invalide");
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status: "closed" }).in("id", parsed.data);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/leads");
}

export async function bulkArchiveLeads(ids: string[]) {
  await requireAdmin();
  const parsed = leadIdsSchema.safeParse(ids);
  if (!parsed.success) {
    throw new Error("Sélection de leads invalide");
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ archived: true }).in("id", parsed.data);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/leads");
}

export async function bulkDeleteLeads(ids: string[]) {
  await requireAdmin();
  const parsed = leadIdsSchema.safeParse(ids);
  if (!parsed.success) {
    throw new Error("Sélection de leads invalide");
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").delete().in("id", parsed.data);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/leads");
}
