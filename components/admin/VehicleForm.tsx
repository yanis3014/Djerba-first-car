"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { VehicleCloudinaryUpload } from "@/components/admin/VehicleCloudinaryUpload";
import type { SaveCarState } from "@/lib/admin/cars-actions";
import { saveCar } from "@/lib/admin/cars-actions";
import type { Car } from "@/lib/types";

const fuels = ["Essence", "Diesel", "Hybride", "Electrique"] as const;
const transmissions = ["Manuelle", "Automatique"] as const;

function fieldError(state: SaveCarState | null, key: string): string | undefined {
  if (!state || state.ok || !state.fieldErrors) return undefined;
  const e = state.fieldErrors[key];
  return Array.isArray(e) ? e[0] : undefined;
}

export function VehicleForm({ car }: { car?: Car | null }) {
  const [state, setState] = useState<SaveCarState | null>(null);
  const [pending, startTransition] = useTransition();
  const [imagesText, setImagesText] = useState(() => car?.images?.join("\n") ?? "");

  return (
    <form
      className="relative mx-auto max-w-3xl space-y-6"
      action={(formData) => {
        formData.set("imagesText", imagesText);
        startTransition(async () => {
          const result = await saveCar(undefined, formData);
          if (result && result.ok === false) {
            setState(result);
          }
        });
      }}
    >
      {car?.id ? (
        <>
          <input type="hidden" name="id" value={car.id} />
          <input type="hidden" name="views" value={car.views} />
        </>
      ) : null}

      {state && !state.ok && state.message ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
            Slug URL (SEO)
          </label>
          <input
            name="slugManual"
            defaultValue={car?.slug ?? ""}
            placeholder="ex. bmw-serie-3-2021 (vide = généré depuis marque / modèle / année)"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Minuscules, chiffres et tirets. Utilisé dans <code className="rounded bg-[var(--color-bg-alt)] px-1">/voitures/…</code>
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Marque</label>
          <input
            name="brand"
            required
            defaultValue={car?.brand}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
          {fieldError(state, "brand") ? (
            <p className="mt-1 text-xs text-red-600">{fieldError(state, "brand")}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Modèle</label>
          <input
            name="model"
            required
            defaultValue={car?.model}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
          {fieldError(state, "model") ? (
            <p className="mt-1 text-xs text-red-600">{fieldError(state, "model")}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Année</label>
          <input
            name="year"
            type="number"
            required
            defaultValue={car?.year}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
          {fieldError(state, "year") ? (
            <p className="mt-1 text-xs text-red-600">{fieldError(state, "year")}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Prix (TND)</label>
          <input
            name="price"
            type="number"
            required
            min={0}
            step={100}
            defaultValue={car?.price}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
          {fieldError(state, "price") ? (
            <p className="mt-1 text-xs text-red-600">{fieldError(state, "price")}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Kilométrage</label>
          <input
            name="mileage"
            type="number"
            required
            min={0}
            defaultValue={car?.mileage}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Portes</label>
          <input
            name="doors"
            type="number"
            required
            min={2}
            max={5}
            defaultValue={car?.doors ?? 4}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Carburant</label>
          <select
            name="fuel_type"
            required
            defaultValue={car?.fuel_type ?? "Essence"}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            {fuels.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Boîte</label>
          <select
            name="transmission"
            required
            defaultValue={car?.transmission ?? "Automatique"}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            {transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Couleur</label>
          <input
            name="color"
            defaultValue={car?.color ?? ""}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Moteur</label>
          <input
            name="engine"
            defaultValue={car?.engine ?? ""}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Puissance (ch)</label>
          <input
            name="power"
            type="number"
            min={0}
            defaultValue={car?.power ?? ""}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">État</label>
          <select
            name="condition"
            required
            defaultValue={car?.condition ?? "used"}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            <option value="new">Neuf</option>
            <option value="used">Occasion</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Statut</label>
          <select
            name="status"
            required
            defaultValue={car?.status ?? "available"}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            <option value="available">Disponible</option>
            <option value="reserved">Réservé</option>
            <option value="sold">Vendu</option>
          </select>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" name="is_featured" defaultChecked={car?.is_featured} className="rounded border-[var(--color-border)]" />
        Mise en avant sur l’accueil
      </label>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={car?.description ?? ""}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Équipements (un par ligne ou séparés par des virgules)
        </label>
        <textarea
          name="featuresText"
          rows={3}
          defaultValue={car?.features?.join("\n") ?? ""}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[var(--color-text)]">Images</label>
          <VehicleCloudinaryUpload
            onUploaded={(url) => {
              setImagesText((prev) => (prev.trim() ? `${prev.trim()}\n${url}` : url));
            }}
          />
        </div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          URLs des images (une par ligne — complétez après upload ou saisissez à la main)
        </label>
        <textarea
          name="imagesText"
          rows={5}
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-xs text-[var(--color-text)]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : car ? "Mettre à jour" : "Créer la fiche"}
        </button>
        <Link
          href="/admin/voitures"
          className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
