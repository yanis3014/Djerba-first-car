import { CarForm } from "@/components/admin/CarForm";

export default function AdminNouvelleVoiturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Ajouter un véhicule</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Renseignez la fiche et les photos ; vous pourrez la modifier ensuite.</p>
      </div>
      <CarForm key="nouvelle" />
    </div>
  );
}
