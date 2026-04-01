import Link from "next/link";
import { deleteCar } from "@/lib/admin/cars-actions";
import { getAllCars } from "@/lib/cars";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);
}

const statusLabel: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

export default async function AdminVoituresPage() {
  const cars = await getAllCars();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Voitures</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{cars.length} fiche{cars.length !== 1 ? "s" : ""} dans le catalogue.</p>
        </div>
        <Link
          href="/admin/voitures/nouvelle"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          Nouvelle fiche
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Véhicule</th>
              <th className="px-4 py-3 font-medium">Année</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Vues</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                  {car.brand} {car.model}
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{car.year}</td>
                <td className="px-4 py-3">{formatPrice(car.price)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs">
                    {statusLabel[car.status] ?? car.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{car.views}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/voitures/${car.id}`}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-bg-alt)]"
                    >
                      Modifier
                    </Link>
                    <form action={deleteCar.bind(null, car.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cars.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--color-muted)]">Aucune voiture. Créez une fiche ou vérifiez Supabase.</p>
        ) : null}
      </div>
    </div>
  );
}
