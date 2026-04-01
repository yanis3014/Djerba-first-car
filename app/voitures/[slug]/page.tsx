import { notFound } from "next/navigation";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import CarGallery from "@/components/public/CarGallery";
import CarCard from "@/components/public/CarCard";
import { getAllCars, getCarBySlug } from "@/lib/cars";
import { createSupabaseServerClient } from "@/lib/supabase";

interface CarDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CarDetailPageProps) {
  const car = await getCarBySlug(params.slug);
  if (!car) return { title: "Voiture introuvable" };
  return {
    title: `${car.brand} ${car.model} ${car.year} | Djerba First Car`,
    description: car.description ?? `${car.brand} ${car.model} disponible a Djerba First Car.`,
    openGraph: {
      images: car.cover_image ? [car.cover_image] : [],
    },
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await getCarBySlug(params.slug);
  if (!car) notFound();

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createSupabaseServerClient();
      await supabase.from("cars").update({ views: car.views + 1 }).eq("id", car.id);
    }
  } catch {
    // Non bloquant: la page detail doit rester accessible meme si l'update echoue.
  }

  const allCars = await getAllCars();
  const similarCars = allCars
    .filter((candidate) => candidate.id !== car.id)
    .filter((candidate) => candidate.brand === car.brand || Math.abs(candidate.price - car.price) <= 20000)
    .slice(0, 3);

  const specs = [
    ["Annee", String(car.year)],
    ["Kilometrage", `${new Intl.NumberFormat("fr-FR").format(car.mileage)} km`],
    ["Carburant", car.fuel_type],
    ["Transmission", car.transmission],
    ["Couleur", car.color ?? "-"],
    ["Moteur", car.engine ?? "-"],
    ["Puissance", car.power ? `${car.power} CV` : "-"],
    ["Portes", String(car.doors)],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section>
            <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-accent)]">
              {car.brand} {car.model} {car.year}
            </h1>
            <p className="mt-2 inline-block rounded-md bg-[var(--color-accent)] px-3 py-1 text-lg font-semibold text-white">
              {new Intl.NumberFormat("fr-FR").format(car.price)} TND
            </p>

            <div className="mt-5">
              <CarGallery images={car.images} alt={`${car.brand} ${car.model}`} />
            </div>

            <div className="mt-6 grid gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label} className="rounded-md border border-[var(--color-border)] p-3">
                  <p className="text-xs uppercase text-[var(--color-muted)]">{label}</p>
                  <p className="mt-1 text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <h2 className="text-lg font-semibold">Equipements</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {car.features.map((feature) => (
                  <li key={feature} className="text-sm text-[var(--color-muted)]">- {feature}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-2 text-[var(--color-muted)]">{car.description ?? "Aucune description."}</p>
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Je suis interesse</h2>
            <form className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Nom complet" />
              <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Telephone" />
              <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Email" />
              <textarea className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" rows={4} defaultValue={`Bonjour, je suis interesse par la ${car.brand} ${car.model}.`} />
              <button type="button" className="w-full rounded-md bg-[var(--color-accent)] px-4 py-2 font-medium text-white hover:bg-[var(--color-accent-hover)]">
                Envoyer
              </button>
            </form>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Bonjour, je suis interesse par la ${car.brand} ${car.model}.`)}`}
              className="mt-3 block rounded-md bg-[var(--color-surface-dark)] px-4 py-2 text-center text-sm text-white hover:opacity-90"
              target="_blank"
              rel="noreferrer"
            >
              Contacter via WhatsApp
            </a>
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-accent)]">Voitures similaires</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similarCars.map((similarCar, index) => (
              <CarCard key={similarCar.id} car={similarCar} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
