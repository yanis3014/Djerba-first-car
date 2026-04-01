"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase";

const schema = z.object({
  car_id: z.string().uuid(),
  name: z.string().min(1, "Nom requis").max(120),
  phone: z.string().min(1, "Téléphone requis").max(40),
  email: z
    .string()
    .max(255)
    .refine((s) => s === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), "Email invalide"),
  message: z.string().max(5000).optional(),
});

export type LeadFormState = { ok: true } | { ok: false; error: string };

export async function submitLeadForCar(_prev: LeadFormState | undefined, formData: FormData): Promise<LeadFormState> {
  const raw = {
    car_id: formData.get("car_id")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ok: false, error: "Configuration serveur incomplète (Supabase)." };
  }

  const v = parsed.data;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("leads").insert({
    car_id: v.car_id,
    name: v.name,
    phone: v.phone,
    email: v.email?.trim() || null,
    message: v.message || null,
    type: "buy",
    status: "new",
    source: "website",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
