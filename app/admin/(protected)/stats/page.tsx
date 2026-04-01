import { getAllCars } from "@/lib/cars";

export default async function AdminStatsPage() {
  const cars = await getAllCars();

  const byStatus = cars.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const byFuel = cars.reduce(
    (acc, c) => {
      acc[c.fuel_type] = (acc[c.fuel_type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const featured = cars.filter((c) => c.is_featured).length;
  const totalValue = cars.reduce((s, c) => s + c.price, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Statistiques</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Répartition du stock et indicateurs simples.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Par statut</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(byStatus).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-[var(--color-border)] py-2 last:border-0">
                <span className="text-[var(--color-muted)]">{k}</span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
            {cars.length === 0 ? <li className="text-[var(--color-muted)]">Aucune donnée.</li> : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Par carburant</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(byFuel).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-[var(--color-border)] py-2 last:border-0">
                <span className="text-[var(--color-muted)]">{k}</span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
            {cars.length === 0 ? <li className="text-[var(--color-muted)]">Aucune donnée.</li> : null}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Synthèse</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Mises en avant</dt>
            <dd className="mt-1 text-2xl font-semibold text-[var(--color-text)]">{featured}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Valeur catalogue (somme des prix)</dt>
            <dd className="mt-1 text-2xl font-semibold text-[var(--color-accent)]">
              {new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(
                totalValue,
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Total vues</dt>
            <dd className="mt-1 text-2xl font-semibold text-[var(--color-text)]">
              {cars.reduce((s, c) => s + c.views, 0)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
