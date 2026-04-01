"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

interface CatalogFiltersProps {
  brands: string[];
  defaults: {
    q?: string;
    brand?: string;
    fuel?: string;
    transmission?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
    sort?: string;
    view?: string;
  };
}

export default function CatalogFilters({ brands, defaults }: CatalogFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <form action="/voitures" method="get">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto]">
          <input
            name="q"
            defaultValue={defaults.q}
            placeholder="Rechercher marque ou modele"
            className="rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
          />

          <select
            name="sort"
            defaultValue={defaults.sort ?? "recent"}
            className="rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
          >
            <option value="recent">Plus recent</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix decroissant</option>
            <option value="mileage-asc">Kilometrage croissant</option>
          </select>

          <select
            name="view"
            defaultValue={defaults.view ?? "grid"}
            className="rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm"
          >
            <option value="grid">Vue grille</option>
            <option value="list">Vue liste</option>
          </select>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtrer
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <select
                    name="brand"
                    defaultValue={defaults.brand ?? ""}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  >
                    <option value="">Toutes les marques</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>

                  <select
                    name="fuel"
                    defaultValue={defaults.fuel ?? ""}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  >
                    <option value="">Tous carburants</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Electrique">Electrique</option>
                  </select>

                  <select
                    name="transmission"
                    defaultValue={defaults.transmission ?? ""}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  >
                    <option value="">Toutes transmissions</option>
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="minYear"
                      type="number"
                      defaultValue={defaults.minYear}
                      placeholder="Annee min"
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    />
                    <input
                      name="maxYear"
                      type="number"
                      defaultValue={defaults.maxYear}
                      placeholder="Annee max"
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    />
                  </div>

                  <input
                    name="minPrice"
                    type="number"
                    defaultValue={defaults.minPrice}
                    placeholder="Prix min"
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  />
                  <input
                    name="maxPrice"
                    type="number"
                    defaultValue={defaults.maxPrice}
                    placeholder="Prix max"
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]">
                    Appliquer les filtres
                  </button>
                  <a
                    href="/voitures"
                    className="rounded-md bg-[var(--color-surface-dark)] px-4 py-2 text-sm font-medium text-white"
                  >
                    Reinitialiser
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
