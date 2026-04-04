"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase";

const schema = z.object({
  phone_display: z.string().max(120),
  whatsapp_number: z.string().max(60),
  contact_email: z.union([z.literal(""), z.string().email("Email invalide.")]),
  address: z.string().min(1, "L’adresse est obligatoire.").max(500),
  instagram_url: z.union([z.literal(""), z.string().url("URL Instagram invalide.")]),
  instagram_label: z.string().max(120),
  facebook_url: z.union([z.literal(""), z.string().url("URL Facebook invalide.")]),
  facebook_label: z.string().max(120),
});

export type UpdateSiteSettingsState = { ok: true } | { ok: false; error: string };

function field(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
}

export async function updateSiteSettings(_prev: UpdateSiteSettingsState | undefined, formData: FormData): Promise<UpdateSiteSettingsState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    phone_display: field(formData, "phone_display"),
    whatsapp_number: field(formData, "whatsapp_number"),
    contact_email: field(formData, "contact_email"),
    address: field(formData, "address"),
    instagram_url: field(formData, "instagram_url"),
    instagram_label: field(formData, "instagram_label"),
    facebook_url: field(formData, "facebook_url"),
    facebook_label: field(formData, "facebook_label"),
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat()[0] ?? "Données invalides.";
    return { ok: false, error: msg };
  }

  const v = parsed.data;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      id: 1,
      phone_display: v.phone_display,
      whatsapp_number: v.whatsapp_number,
      contact_email: v.contact_email,
      address: v.address,
      instagram_url: v.instagram_url,
      instagram_label: v.instagram_label,
      facebook_url: v.facebook_url,
      facebook_label: v.facebook_label,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/voitures");
  revalidatePath("/services");

  return { ok: true };
}
