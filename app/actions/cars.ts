"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { extractPublicIdFromCloudinaryUrl } from "@/lib/cloudinary-public-id";
import { slugify } from "@/lib/slugify";
import { createSupabaseServerClient } from "@/lib/supabase";

export type CarPayload = {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color?: string;
  engine?: string;
  power?: number;
  doors: number;
  condition: string;
  status: string;
  description?: string;
  features: string[];
  images: string[];
  cover_image: string;
  is_featured: boolean;
};

function rowFromPayload(data: CarPayload) {
  const cover = data.cover_image?.trim() || data.images[0] || null;
  return {
    brand: data.brand,
    model: data.model,
    year: data.year,
    price: data.price,
    mileage: data.mileage,
    fuel_type: data.fuel_type,
    transmission: data.transmission,
    color: data.color?.trim() || null,
    engine: data.engine?.trim() || null,
    power: data.power ?? null,
    doors: data.doors,
    condition: data.condition,
    status: data.status,
    description: data.description?.trim() || null,
    features: data.features,
    images: data.images,
    cover_image: cover,
    is_featured: data.is_featured,
  };
}

export async function createCar(data: CarPayload): Promise<{ id: string }> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const slug = `${slugify(data.brand)}-${slugify(data.model)}-${data.year}-${Date.now()}`;

  const { data: row, error } = await supabase
    .from("cars")
    .insert({
      ...rowFromPayload(data),
      slug,
      views: 0,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/voitures");
  revalidatePath("/admin/voitures");
  return { id: row.id };
}

export async function updateCar(id: string, data: CarPayload) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  const { data: existing, error: fetchErr } = await supabase.from("cars").select("slug").eq("id", id).single();
  if (fetchErr) throw new Error(fetchErr.message);

  const { error } = await supabase
    .from("cars")
    .update({
      ...rowFromPayload(data),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/voitures");
  revalidatePath("/admin/voitures");
  if (existing?.slug) {
    revalidatePath(`/voitures/${existing.slug}`);
  }
}

export async function deleteCar(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  const { data: car, error: fetchErr } = await supabase.from("cars").select("images").eq("id", id).single();
  if (fetchErr) throw new Error(fetchErr.message);

  const images = Array.isArray(car?.images) ? (car.images as string[]) : [];
  for (const url of images) {
    const publicId = extractPublicIdFromCloudinaryUrl(url);
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    }
  }

  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/voitures");
  revalidatePath("/admin/voitures");
}

export async function deleteCarImage(publicId: string) {
  await requireAdmin();
  return deleteCloudinaryImage(publicId);
}
