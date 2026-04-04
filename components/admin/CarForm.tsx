"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { z } from "zod";
import { createCar, updateCar, type CarPayload } from "@/app/actions/cars";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
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

const fuelEnum = z.enum(
  ["Essence", "Diesel", "Hybride", "Electrique"],
  "Choisissez un type de carburant valide.",
);
const transmissionEnum = z.enum(["Manuelle", "Automatique"], "Choisissez un type de boîte valide.");
const conditionEnum = z.enum(["used", "new"], "Choisissez l’état du véhicule.");
const statusEnum = z.enum(["available", "sold", "reserved"], "Choisissez un statut valide.");

const carSchema = z
  .object({
    brand: z.string().min(1, "La marque est obligatoire."),
    model: z.string().min(1, "Le modèle est obligatoire."),
    year: z.coerce
      .number("Indiquez une année valide.")
      .refine((n) => Number.isFinite(n), "Indiquez une année valide.")
      .min(1990, "L’année doit être au moins 1990.")
      .max(maxYear, `L’année ne peut pas dépasser ${maxYear}.`),
    price: z.coerce
      .number("Indiquez un prix valide.")
      .refine((n) => Number.isFinite(n), "Indiquez un prix valide.")
      .min(1000, "Le prix minimum est de 1 000 TND."),
    mileage: z.coerce
      .number("Indiquez un kilométrage valide.")
      .refine((n) => Number.isFinite(n), "Indiquez un kilométrage valide.")
      .min(0, "Le kilométrage ne peut pas être négatif."),
    fuel_type: fuelEnum,
    transmission: transmissionEnum,
    color: z.string().optional(),
    engine: z.string().optional(),
    power: z.number().max(2000, "La puissance ne peut pas dépasser 2000 ch.").optional(),
    doors: z.coerce
      .number("Indiquez un nombre de portes valide.")
      .refine((n) => Number.isFinite(n), "Indiquez un nombre de portes valide.")
      .min(2, "Le nombre de portes doit être au moins 2.")
      .max(5, "Le nombre de portes ne peut pas dépasser 5."),
    condition: conditionEnum,
    status: statusEnum,
    description: z.string().optional(),
    features: z.array(z.string()).default([]),
    is_featured: z.boolean().default(false),
    images: z.array(z.string()).max(10, "Vous ne pouvez pas ajouter plus de 10 photos.").default([]),
    cover_image: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.cover_image && !data.images.includes(data.cover_image)) {
      ctx.addIssue({
        code: "custom",
        message: "L’image principale doit être présente dans la liste des photos.",
        path: ["cover_image"],
      });
    }
  });

export type CarFormValues = z.infer<typeof carSchema>;

const TAB_IDS = ["base", "tech", "price", "media"] as const;
type TabId = (typeof TAB_IDS)[number];

const TAB_FIELD_KEYS: Record<TabId, (keyof CarFormValues)[]> = {
  base: ["brand", "model", "year", "condition", "status", "description", "is_featured"],
  tech: ["mileage", "fuel_type", "transmission", "color", "engine", "power", "doors", "features"],
  price: ["price"],
  media: ["images", "cover_image"],
};

function tabHasErrors(errors: FieldErrors<CarFormValues>, tab: TabId): boolean {
  return TAB_FIELD_KEYS[tab].some((key) => errors[key] != null);
}

function firstTabWithErrors(errors: FieldErrors<CarFormValues>): TabId | null {
  for (const id of TAB_IDS) {
    if (tabHasErrors(errors, id)) return id;
  }
  return null;
}

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm font-medium text-red-500" role="alert">
      {message}
    </p>
  );
}

function inputFieldClass(hasError: boolean) {
  return cn(
    "w-full rounded-lg border bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none transition placeholder:text-neutral-600",
    hasError ? "border-red-500 ring-1 ring-red-500/35" : "border-[#333] focus:border-red-600 focus:ring-0",
  );
}

export function CarForm({ car }: { car?: Car | null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("base");

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

  const images = watch("images");
  const coverImage = watch("cover_image");
  const features = watch("features");

  function toggleFeature(label: string, checked: boolean) {
    const cur = getValues("features");
    const next = checked ? [...new Set([...cur, label])] : cur.filter((f) => f !== label);
    setValue("features", next, { shouldDirty: true, shouldValidate: true });
  }

  function handleImagesChange(next: string[]) {
    const cover = getValues("cover_image");
    setValue("images", next, { shouldDirty: true, shouldValidate: true });
    if (cover && !next.includes(cover)) {
      setValue("cover_image", next[0] ?? "", { shouldDirty: true, shouldValidate: true });
    }
  }

  const onInvalid = useCallback((formErrors: FieldErrors<CarFormValues>) => {
    const tab = firstTabWithErrors(formErrors);
    if (tab) setActiveTab(tab);
  }, []);

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
        toast.success("Véhicule mis à jour", { description: "Les modifications ont été enregistrées." });
        router.refresh();
      } else {
        const { id } = await createCar(payload);
        toast.success("Véhicule ajouté avec succès", { description: "Redirection vers la fiche…" });
        router.push(`/admin/voitures/${id}`);
        router.refresh();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Une erreur est survenue.";
      toast.error("Enregistrement impossible", { description: message });
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
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6 rounded-2xl border border-[#333] bg-[#111] p-6 md:p-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="w-full">
          <TabsList className="h-auto w-full justify-stretch gap-1 p-1.5">
            {(
              [
                { id: "base" as const, label: "Informations de base" },
                { id: "tech" as const, label: "Caractéristiques techniques" },
                { id: "price" as const, label: "Prix" },
                { id: "media" as const, label: "Médias" },
              ] as const
            ).map(({ id, label }) => (
              <TabsTrigger
                key={id}
                value={id}
                className={cn(
                  "relative flex-1 gap-1.5 px-2 py-2.5 sm:px-3",
                  tabHasErrors(errors, id) && "text-red-400 data-[state=inactive]:text-red-400/90",
                )}
              >
                <span className="text-center leading-tight">{label}</span>
                {tabHasErrors(errors, id) ? (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 sm:right-2 sm:top-2" aria-hidden />
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="base" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="car-brand" className="mb-1 block text-xs text-neutral-400">
                  Marque
                </label>
                <input
                  id="car-brand"
                  {...register("brand")}
                  aria-invalid={errors.brand ? "true" : "false"}
                  className={inputFieldClass(!!errors.brand)}
                />
                <FieldError message={errors.brand?.message} />
              </div>
              <div>
                <label htmlFor="car-model" className="mb-1 block text-xs text-neutral-400">
                  Modèle
                </label>
                <input
                  id="car-model"
                  {...register("model")}
                  aria-invalid={errors.model ? "true" : "false"}
                  className={inputFieldClass(!!errors.model)}
                />
                <FieldError message={errors.model?.message} />
              </div>
              <div>
                <label htmlFor="car-year" className="mb-1 block text-xs text-neutral-400">
                  Année
                </label>
                <input
                  id="car-year"
                  type="number"
                  {...register("year")}
                  aria-invalid={errors.year ? "true" : "false"}
                  className={inputFieldClass(!!errors.year)}
                />
                <FieldError message={errors.year?.message} />
              </div>
              <div>
                <label htmlFor="car-condition" className="mb-1 block text-xs text-neutral-400">
                  État
                </label>
                <select
                  id="car-condition"
                  {...register("condition")}
                  aria-invalid={errors.condition ? "true" : "false"}
                  className={inputFieldClass(!!errors.condition)}
                >
                  <option value="used">Occasion</option>
                  <option value="new">Neuf</option>
                </select>
                <FieldError message={errors.condition?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="car-status" className="mb-1 block text-xs text-neutral-400">
                  Statut
                </label>
                <select
                  id="car-status"
                  {...register("status")}
                  aria-invalid={errors.status ? "true" : "false"}
                  className={inputFieldClass(!!errors.status)}
                >
                  <option value="available">Disponible</option>
                  <option value="sold">Vendu</option>
                  <option value="reserved">Réservé</option>
                </select>
                <FieldError message={errors.status?.message} />
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
              <label htmlFor="car-description" className="mb-1 block text-xs text-neutral-400">
                Description
              </label>
              <textarea
                id="car-description"
                rows={4}
                {...register("description")}
                aria-invalid={errors.description ? "true" : "false"}
                className={inputFieldClass(!!errors.description)}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="car-mileage" className="mb-1 block text-xs text-neutral-400">
                  Kilométrage
                </label>
                <div className="relative">
                  <input
                    id="car-mileage"
                    type="number"
                    {...register("mileage")}
                    aria-invalid={errors.mileage ? "true" : "false"}
                    className={cn(inputFieldClass(!!errors.mileage), "pr-10")}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
                    km
                  </span>
                </div>
                <FieldError message={errors.mileage?.message} />
              </div>
              <div>
                <label htmlFor="car-fuel" className="mb-1 block text-xs text-neutral-400">
                  Carburant
                </label>
                <select
                  id="car-fuel"
                  {...register("fuel_type")}
                  aria-invalid={errors.fuel_type ? "true" : "false"}
                  className={inputFieldClass(!!errors.fuel_type)}
                >
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Electrique">Électrique</option>
                </select>
                <FieldError message={errors.fuel_type?.message} />
              </div>
              <div>
                <label htmlFor="car-transmission" className="mb-1 block text-xs text-neutral-400">
                  Boîte
                </label>
                <select
                  id="car-transmission"
                  {...register("transmission")}
                  aria-invalid={errors.transmission ? "true" : "false"}
                  className={inputFieldClass(!!errors.transmission)}
                >
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
                <FieldError message={errors.transmission?.message} />
              </div>
              <div>
                <label htmlFor="car-doors" className="mb-1 block text-xs text-neutral-400">
                  Portes
                </label>
                <input
                  id="car-doors"
                  type="number"
                  {...register("doors")}
                  aria-invalid={errors.doors ? "true" : "false"}
                  className={inputFieldClass(!!errors.doors)}
                />
                <FieldError message={errors.doors?.message} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="car-color" className="mb-1 block text-xs text-neutral-400">
                  Couleur
                </label>
                <input
                  id="car-color"
                  {...register("color")}
                  aria-invalid={errors.color ? "true" : "false"}
                  className={inputFieldClass(!!errors.color)}
                />
                <FieldError message={errors.color?.message} />
              </div>
              <div>
                <label htmlFor="car-engine" className="mb-1 block text-xs text-neutral-400">
                  Moteur
                </label>
                <input
                  id="car-engine"
                  {...register("engine")}
                  aria-invalid={errors.engine ? "true" : "false"}
                  className={inputFieldClass(!!errors.engine)}
                />
                <FieldError message={errors.engine?.message} />
              </div>
              <div>
                <label htmlFor="car-power" className="mb-1 block text-xs text-neutral-400">
                  Puissance
                </label>
                <div className="relative">
                  <input
                    id="car-power"
                    type="number"
                    {...register("power", {
                      setValueAs: (v) => {
                        if (v === "" || v === null || v === undefined) return undefined;
                        const n = Number(v);
                        return Number.isFinite(n) ? n : undefined;
                      },
                    })}
                    aria-invalid={errors.power ? "true" : "false"}
                    className={cn(inputFieldClass(!!errors.power), "pr-10")}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
                    ch
                  </span>
                </div>
                <FieldError message={errors.power?.message} />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-neutral-300">Équipements</p>
              <FieldError message={errors.features?.message} />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {renderFeatureColumn("Confort", comfortFeatures)}
                {renderFeatureColumn("Sécurité", securityFeatures)}
                {renderFeatureColumn("Multimédia", multimediaFeatures)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="price" className="space-y-4">
            <div className="max-w-md">
              <label htmlFor="car-price" className="mb-1 block text-xs text-neutral-400">
                Prix (TND)
              </label>
              <div className="relative">
                <input
                  id="car-price"
                  type="number"
                  {...register("price")}
                  aria-invalid={errors.price ? "true" : "false"}
                  className={cn(inputFieldClass(!!errors.price), "pr-12")}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
                  TND
                </span>
              </div>
              <FieldError message={errors.price?.message} />
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-300">Photos</p>
              <ImageUploader
                images={images}
                coverImage={coverImage}
                onChange={handleImagesChange}
                onCoverChange={(url) => setValue("cover_image", url, { shouldDirty: true, shouldValidate: true })}
                errorMessage={errors.images?.message}
              />
              <FieldError message={errors.cover_image?.message} />
            </div>
          </TabsContent>
        </Tabs>

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
