"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { createCar, updateCar, type CarPayload } from "@/app/actions/cars";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Car } from "@/lib/types";

const maxYear = new Date().getFullYear() + 1;

const comfortFeatures = [
  "Climatisation",
  "Sièges chauffants",
  "Toit ouvrant",
  "Vitres électriques",
  "Rétroviseurs électriques",
  "Régulateur de vitesse",
] as const;

const securityFeatures = [
  "ABS",
  "Airbags",
  "ESP",
  "Caméra de recul",
  "Capteurs de stationnement",
  "Alerte franchissement de ligne",
] as const;

const multimediaFeatures = [
  "GPS",
  "Bluetooth",
  "Écran tactile",
  "Apple CarPlay",
  "Android Auto",
  "Système audio premium",
] as const;

const carSchema = z.object({
  brand: z.string().min(1, "Marque requise"),
  model: z.string().min(1, "Modèle requis"),
  year: z.coerce.number().min(1990).max(maxYear),
  price: z.coerce.number().min(1000, "Prix minimum 1000 TND"),
  mileage: z.coerce.number().min(0),
  fuel_type: z.enum(["Essence", "Diesel", "Hybride", "Electrique"]),
  transmission: z.enum(["Manuelle", "Automatique"]),
  color: z.string().optional(),
  engine: z.string().optional(),
  power: z.number().optional(),
  doors: z.coerce.number().min(2).max(5),
  condition: z.enum(["used", "new"]),
  status: z.enum(["available", "sold", "reserved"]),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  cover_image: z.string().default(""),
});

export type CarFormValues = z.infer<typeof carSchema>;

function defaultsFromCar(car?: Car | null): CarFormValues {
  if (!car) {
    return {
      brand: "",
      model: "",
      year: maxYear - 1,
      price: 1000,
      mileage: 0,
      fuel_type: "Essence",
      transmission: "Automatique",
      color: "",
      engine: "",
      power: undefined,
      doors: 5,
      condition: "used",
      status: "available",
      description: "",
      features: [],
      is_featured: false,
      images: [],
      cover_image: "",
    };
  }
  return {
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuel_type: car.fuel_type,
    transmission: car.transmission,
    color: car.color ?? "",
    engine: car.engine ?? "",
    power: car.power ?? undefined,
    doors: car.doors,
    condition: car.condition,
    status: car.status,
    description: car.description ?? "",
    features: car.features ?? [],
    is_featured: car.is_featured,
    images: car.images ?? [],
    cover_image: car.cover_image ?? car.images?.[0] ?? "",
  };
}

export function CarForm({ car }: { car?: Car | null }) {
  const router = useRouter();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema) as Resolver<CarFormValues>,
    defaultValues: defaultsFromCar(car),
  });

  useEffect(() => {
    reset(defaultsFromCar(car));
  }, [car, reset]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const images = watch("images");
  const coverImage = watch("cover_image");
  const features = watch("features");

  function toggleFeature(label: string, checked: boolean) {
    const cur = getValues("features");
    const next = checked ? [...new Set([...cur, label])] : cur.filter((f) => f !== label);
    setValue("features", next, { shouldDirty: true });
  }

  function handleImagesChange(next: string[]) {
    const cover = getValues("cover_image");
    setValue("images", next, { shouldDirty: true });
    if (cover && !next.includes(cover)) {
      setValue("cover_image", next[0] ?? "", { shouldDirty: true });
    }
  }

  async function onSubmit(values: CarFormValues) {
    const payload: CarPayload = {
      brand: values.brand,
      model: values.model,
      year: values.year,
      price: values.price,
      mileage: values.mileage,
      fuel_type: values.fuel_type,
      transmission: values.transmission,
      color: values.color,
      engine: values.engine,
      power: values.power,
      doors: values.doors,
      condition: values.condition,
      status: values.status,
      description: values.description,
      features: values.features,
      images: values.images,
      cover_image: values.cover_image,
      is_featured: values.is_featured,
    };

    try {
      if (car?.id) {
        await updateCar(car.id, payload);
        setToast({ type: "success", message: "Véhicule mis à jour." });
        router.refresh();
      } else {
        const { id } = await createCar(payload);
        setToast({ type: "success", message: "Véhicule créé." });
        router.push(`/admin/voitures/${id}`);
        router.refresh();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Une erreur est survenue.";
      setToast({ type: "error", message });
    }
  }

  function renderFeatureColumn(title: string, items: readonly string[]) {
    return (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</p>
        <ul className="space-y-2">
          {items.map((label) => (
            <li key={label}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={features.includes(label)}
                  onChange={(e) => toggleFeature(label, e.target.checked)}
                  className="rounded border-[#444] bg-[#1a1a1a] text-red-600 focus:ring-red-500"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative text-white">
      {toast ? (
        <div
          role="status"
          className={`fixed right-4 top-4 z-50 max-w-sm rounded-lg px-4 py-3 text-sm shadow-lg ${
            toast.type === "success" ? "bg-emerald-900 text-emerald-100" : "bg-red-900 text-red-100"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-[#333] bg-[#111] p-6 md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Marque</label>
            <input
              {...register("brand")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            />
            {errors.brand ? <p className="mt-1 text-xs text-red-400">{errors.brand.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Modèle</label>
            <input
              {...register("model")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            />
            {errors.model ? <p className="mt-1 text-xs text-red-400">{errors.model.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Année</label>
            <input
              type="number"
              {...register("year")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            />
            {errors.year ? <p className="mt-1 text-xs text-red-400">{errors.year.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">État</label>
            <select
              {...register("condition")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="used">Occasion</option>
              <option value="new">Neuf</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Prix (TND)</label>
            <div className="relative">
              <input
                type="number"
                {...register("price")}
                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 pr-12 text-sm outline-none focus:border-red-600"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">TND</span>
            </div>
            {errors.price ? <p className="mt-1 text-xs text-red-400">{errors.price.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Kilométrage</label>
            <div className="relative">
              <input
                type="number"
                {...register("mileage")}
                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 pr-10 text-sm outline-none focus:border-red-600"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">km</span>
            </div>
            {errors.mileage ? <p className="mt-1 text-xs text-red-400">{errors.mileage.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Carburant</label>
            <select
              {...register("fuel_type")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybride">Hybride</option>
              <option value="Electrique">Électrique</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Boîte</label>
            <select
              {...register("transmission")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Couleur</label>
            <input
              {...register("color")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Moteur</label>
            <input
              {...register("engine")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Puissance</label>
            <div className="relative">
              <input
                type="number"
                {...register("power", {
                  setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
                })}
                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 pr-10 text-sm outline-none focus:border-red-600"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">cv</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Portes</label>
            <input
              type="number"
              {...register("doors")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            />
            {errors.doors ? <p className="mt-1 text-xs text-red-400">{errors.doors.message}</p> : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Statut</label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
            >
              <option value="available">Disponible</option>
              <option value="sold">Vendu</option>
              <option value="reserved">Réservé</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              role="switch"
              aria-checked={watch("is_featured")}
              onClick={() => setValue("is_featured", !getValues("is_featured"), { shouldDirty: true })}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm transition ${
                watch("is_featured") ? "border-amber-500/50 bg-amber-950/30" : "border-[#333] bg-[#0a0a0a]"
              }`}
            >
              <span>En vedette</span>
              <span
                className={`relative h-6 w-11 rounded-full transition ${
                  watch("is_featured") ? "bg-amber-500" : "bg-neutral-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    watch("is_featured") ? "left-5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-neutral-400">Description</label>
          <textarea
            rows={4}
            {...register("description")}
            className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm outline-none focus:border-red-600"
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-neutral-300">Équipements</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {renderFeatureColumn("Confort", comfortFeatures)}
            {renderFeatureColumn("Sécurité", securityFeatures)}
            {renderFeatureColumn("Multimédia", multimediaFeatures)}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-300">Photos</p>
          <ImageUploader
            images={images}
            coverImage={coverImage}
            onChange={handleImagesChange}
            onCoverChange={(url) => setValue("cover_image", url, { shouldDirty: true })}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {isSubmitting ? "Enregistrement…" : "Enregistrer le véhicule"}
        </button>
      </form>
    </div>
  );
}
