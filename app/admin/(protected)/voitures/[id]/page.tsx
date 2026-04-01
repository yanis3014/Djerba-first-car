import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { getCarById } from "@/lib/cars";

export default async function AdminEditVoiturePage({ params }: { params: { id: string } }) {
  const car = await getCarById(params.id);
  if (!car) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">
          Modifier — {car.brand} {car.model}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Slug public : {car.slug}</p>
      </div>
      <VehicleForm key={car.id} car={car} />
    </div>
  );
}
