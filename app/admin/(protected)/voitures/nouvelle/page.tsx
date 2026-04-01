import { VehicleForm } from "@/components/admin/VehicleForm";

export default function AdminNouvelleVoiturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Nouvelle voiture</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Créez une fiche ; vous pourrez la modifier ensuite.</p>
      </div>
      <VehicleForm key="nouvelle" />
    </div>
  );
}
