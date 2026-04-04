import Link from "next/link";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { VoituresAdminTable } from "@/components/admin/VoituresAdminTable";
import { getAllCars } from "@/lib/cars";
import { asCsvRows } from "@/lib/csv";

export default async function AdminVoituresPage() {
  const cars = await getAllCars();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Gestion des véhicules</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{cars.length} fiche{cars.length !== 1 ? "s" : ""} au total.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CsvExportButton
            rows={asCsvRows(cars)}
            filename="djerba-voitures.csv"
            className="shrink-0"
          />
          <Link
            href="/admin/voitures/nouvelle"
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Ajouter un véhicule
          </Link>
        </div>
      </div>

      <VoituresAdminTable cars={cars} />
    </div>
  );
}
