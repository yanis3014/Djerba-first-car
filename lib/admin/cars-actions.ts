"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeSlugInput, slugify } from "@/lib/slugify";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { CarCondition, CarStatus, FuelType, TransmissionType } from "@/lib/types";

const schema = z.object({
  id: z.string().uuid().optional(),
  brand: z.string().min(1, "Marque requise"),
  model: z.string().min(1, "Modèle requis"),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0),
  mileage: z.coerce.number().int().min(0),
  fuel_type: z.enum(["Essence", "Diesel", "Hybride", "Electrique"]),
  transmission: z.enum(["Manuelle", "Automatique"]),
  color: z.string().optional(),
  engine: z.string().optional(),
  powerInput: z.string().optional(),
  doors: z.coerce.number().int().min(2).max(5),
  condition: z.enum(["new", "used"]),
  status: z.enum(["available", "sold", "reserved"]),
  description: z.string().optional(),
  featuresText: z.string().optional(),
  imagesText: z.string().optional(),
  slugManual: z.string().max(180).optional(),
  is_featured: z.boolean(),
  views: z.coerce.number().int().min(0).optional(),
});

function parseList(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function defaultSlug(brand: string, model: string, year: number) {
  return `${slugify(brand)}-${slugify(model)}-${year}`;
}

function resolveSlug(brand: string, model: string, year: number, manual?: string) {
  const m = manual?.trim();
  if (m) return normalizeSlugInput(m);
  return defaultSlug(brand, model, year);
}

export type SaveCarState =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string[] | undefined>; message?: string };

export async function saveCar(_prev: SaveCarState | undefined, formData: FormData): Promise<SaveCarState> {
  await requireAdmin();

  const raw = {
    id: formData.get("id")?.toString() || undefined,
    brand: formData.get("brand")?.toString() ?? "",
    model: formData.get("model")?.toString() ?? "",
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage"),
    fuel_type: formData.get("fuel_type")?.toString(),
    transmission: formData.get("transmission")?.toString(),
    color: formData.get("color")?.toString() || undefined,
    engine: formData.get("engine")?.toString() || undefined,
    powerInput: formData.get("power")?.toString() || undefined,
    doors: formData.get("doors"),
    condition: formData.get("condition")?.toString(),
    status: formData.get("status")?.toString(),
    description: formData.get("description")?.toString() || undefined,
    featuresText: formData.get("featuresText")?.toString() || undefined,
    imagesText: formData.get("imagesText")?.toString() || undefined,
    slugManual: formData.get("slugManual")?.toString() || undefined,
    is_featured: formData.get("is_featured") === "on",
    views: formData.get("views")?.toString(),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const v = parsed.data;
  const features = parseList(v.featuresText);
  const images = parseList(v.imagesText);
  let power: number | null = null;
  if (v.powerInput?.trim()) {
    const p = Number.parseInt(v.powerInput.trim(), 10);
    if (Number.isFinite(p) && p >= 0) power = p;
  }

  const supabase = createSupabaseServerClient();

  const payload = {
    brand: v.brand,
    model: v.model,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    fuel_type: v.fuel_type as FuelType,
    transmission: v.transmission as TransmissionType,
    color: v.color || null,
    engine: v.engine || null,
    power,
    doors: v.doors,
    condition: v.condition as CarCondition,
    status: v.status as CarStatus,
    description: v.description || null,
    features,
    images,
    is_featured: v.is_featured ?? false,
  };

  if (v.id) {
    const slug = resolveSlug(v.brand, v.model, v.year, v.slugManual);
    const { error } = await supabase
      .from("cars")
      .update({
        ...payload,
        slug,
        views: v.views ?? 0,
        cover_image: images[0] ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", v.id);

    if (error) {
      if (error.code === "23505" || error.message.toLowerCase().includes("duplicate")) {
        return { ok: false, message: "Ce slug URL existe déjà. Modifiez le champ Slug." };
      }
      return { ok: false, message: error.message };
    }
    revalidatePath("/admin/voitures");
    revalidatePath("/voitures");
    revalidatePath(`/voitures/${slug}`);
    redirect("/admin/voitures");
  }

  const slug = resolveSlug(v.brand, v.model, v.year, v.slugManual);
  const { data, error } = await supabase
    .from("cars")
    .insert({
      ...payload,
      slug,
      views: 0,
      cover_image: images[0] ?? null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505" || error.message.toLowerCase().includes("duplicate")) {
      return { ok: false, message: "Ce slug URL existe déjà. Choisissez un autre slug." };
    }
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/voitures");
  revalidatePath("/voitures");
  redirect(`/admin/voitures/${data.id}`);
}

export async function deleteCar(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/voitures");
  revalidatePath("/voitures");
  redirect("/admin/voitures");
}
