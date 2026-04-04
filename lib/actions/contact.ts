"use server";

import { z } from "zod";
import { notifyContactMessageEmail } from "@/lib/email/notify";
import { allowPublicFormSubmission, isHoneypotTriggered } from "@/lib/public-form-guard";
import { createSupabaseServerClient } from "@/lib/supabase";

const messageRequestTypeSchema = z.enum(["info", "sell", "exchange", "visit", "other"]);

const schema = z.object({
  name: z.string().min(1, "Nom requis").max(120),
  phone: z.string().max(40).optional(),
  email: z
    .string()
    .max(255)
    .refine((s) => s === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), "Email invalide"),
  subject: z.string().max(200).optional(),
  type: messageRequestTypeSchema.catch("info"),
  message: z.string().min(1, "Message requis").max(5000),
});

export type ContactFormState = { ok: true } | { ok: false; error: string };

export async function submitContactMessage(_prev: ContactFormState | undefined, formData: FormData): Promise<ContactFormState> {
  if (isHoneypotTriggered(formData)) {
    return { ok: true };
  }

  const rate = await allowPublicFormSubmission();
  if (!rate.ok) {
    return { ok: false, error: "Trop de requêtes. Réessayez dans une minute." };
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    subject: formData.get("subject")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "info",
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
  const { error } = await supabase.from("messages").insert({
    name: v.name,
    phone: v.phone?.trim() || null,
    email: v.email?.trim() || null,
    subject: v.subject || null,
    type: v.type,
    message: v.message,
    is_read: false,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  try {
    await notifyContactMessageEmail({
      name: v.name,
      phone: v.phone?.trim() || null,
      email: v.email?.trim() || null,
      subject: v.subject || null,
      type: v.type,
      message: v.message,
    });
  } catch {
    /* email optionnel */
  }

  return { ok: true };
}
