"use client";

import { CarFront, Eye, Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCar } from "@/app/actions/cars";
import type { Car } from "@/lib/types";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);
}

const statusLabel: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

type StatusFilter = "all" | "available" | "sold" | "reserved";

export function VoituresAdminTable({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<StatusFilter>("all");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cars.filter((c) => {
      const matchStatus = statusTab === "all" || c.status === statusTab;
      const hay = `${c.brand} ${c.model}`.toLowerCase();
      const matchSearch = !q || hay.includes(q);
      return matchStatus && matchSearch;
    });
  }, [cars, search, statusTab]);

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce véhicule et ses images Cloudinary ?")) return;
    startTransition(async () => {
      try {
        await deleteCar(id);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Suppression impossible.");
      }
    });
  }

  const tabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "Tous" },
    { id: "available", label: "Disponible" },
    { id: "sold", label: "Vendu" },
    { id: "reserved", label: "Réservé" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher marque ou modèle…"
          className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]"
        />
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setStatusTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                statusTab === t.id
                  ? "bg-red-600 text-white"
                  : "border border-[var(--color-border)] bg-[var(--color-bg-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="px-3 py-3 font-medium"> </th>
              <th className="px-3 py-3 font-medium">Véhicule</th>
              <th className="px-3 py-3 font-medium">Prix</th>
              <th className="px-3 py-3 font-medium">Statut</th>
              <th className="px-3 py-3 font-medium">Vues</th>
              <th className="px-3 py-3 font-medium">Vedette</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((car) => {
              const thumb = car.cover_image || car.images?.[0];
              return (
                <tr key={car.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-3 py-2">
                    <div className="relative h-[60px] w-[60px] overflow-hidden rounded-lg bg-[var(--color-bg-alt)]">
                      {thumb ? (
                        <Image src={thumb} alt="" fill className="object-cover" sizes="60px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-muted)]">
                          <CarFront className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-medium text-[var(--color-text)]">
                    <div>
                      {car.brand} {car.model}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">{car.year}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatPrice(car.price)}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs">
                      {statusLabel[car.status] ?? car.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[var(--color-muted)]">{car.views}</td>
                  <td className="px-3 py-2">
                    <Star
                      className={`h-5 w-5 ${car.is_featured ? "fill-amber-400 text-amber-400" : "text-[var(--color-muted)]"}`}
                      aria-label={car.is_featured ? "En vedette" : "Pas en vedette"}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/voitures/${car.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]"
                        title="Voir la fiche publique"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/voitures/${car.id}`}
                        className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => handleDelete(car.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/40"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-[var(--color-muted)]">
            <CarFront className="h-10 w-10 opacity-50" />
            <p className="text-sm">Aucun véhicule</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
