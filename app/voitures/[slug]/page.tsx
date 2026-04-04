import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Car as CarIcon,
  Check,
  DoorOpen,
  Fuel,
  Gauge,
  Palette,
  Settings,
  Zap,
} from "lucide-react";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import CarGallery from "@/components/public/CarGallery";
import CarCard from "@/components/public/CarCard";
import { CarLeadForm } from "@/components/public/CarLeadForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { groupCarFeatures } from "@/lib/car-features-group";
import { getAllCars, getCarBySlug } from "@/lib/cars";
import { productJsonLd } from "@/lib/seo/json-ld";
import { createSupabaseServerClient } from "@/lib/supabase";
import { SITE_NAME } from "@/lib/site";
import type { Car, CarStatus } from "@/lib/types";

function scoreSimilarity(target: Car, candidate: Car): number {
  let score = 0;

  const sameBrand = candidate.brand === target.brand;
  const sameFuel = candidate.fuel_type === target.fuel_type;

  if (sameBrand && sameFuel) score += 40;
  else if (sameBrand) score += 30;
  else if (sameFuel) score += 20;

  if (candidate.transmission === target.transmission) score += 15;
  if (candidate.condition === target.condition) score += 15;

  const priceDiff = Math.abs(candidate.price - target.price);
  if (priceDiff <= 10000) score += 10;
  else if (priceDiff <= 20000) score += 5;

  if (Math.abs(candidate.year - target.year) <= 2) score += 5;

  if (candidate.status === "sold") score -= 50;

  return score;
}

interface CarDetailPageProps {
  params: { slug: string };
}

function statusBadge(status: CarStatus) {
  if (status === "sold") {
    return (
      <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-800">
        Vendu
      </span>
    );
  }
  if (status === "reserved") {
    return (
      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-900">
        Réservé
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
      Disponible
    </span>
  );
}

export async function generateMetadata({ params }: CarDetailPageProps) {
  const car = await getCarBySlug(params.slug);
  if (!car) return { title: "Voiture introuvable" };
  const desc = car.description ?? `${car.brand} ${car.model} — ${car.year} — ${SITE_NAME}.`;
  return {
    title: `${car.brand} ${car.model} ${car.year}`,
    description: desc,
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year}`,
      description: desc,
      images: car.cover_image ? [car.cover_image] : car.images[0] ? [car.images[0]] : [],
    },
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const car = await getCarBySlug(params.slug);
  if (!car) notFound();

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createSupabaseServerClient();
      await supabase.rpc("increment_car_views", { p_id: car.id });
    }
  } catch {
    // Non bloquant: la page detail doit rester accessible meme si l'update echoue.
  }

  const allCars = await getAllCars();

  const similarCars = allCars
    .filter((c) => c.id !== car.id)
    .map((c) => ({ car: c, score: scoreSimilarity(car, c) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ car: c }) => c);

  if (similarCars.length < 3) {
    const fallback = allCars
      .filter(
        (c) =>
          c.id !== car.id && !similarCars.some((s) => s.id === c.id) && c.status === "available",
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3 - similarCars.length);

    similarCars.push(...fallback);
  }

  const priceFormatted = new Intl.NumberFormat("fr-FR").format(car.price);
  const mileageFormatted = new Intl.NumberFormat("fr-FR").format(car.mileage);
  const heroSrc = car.cover_image ?? car.images[0] ?? "";

  const specPills: {
    label: string;
    value: string;
    Icon: typeof Calendar;
  }[] = [
    { label: "Année", value: String(car.year), Icon: Calendar },
    { label: "Kilométrage", value: `${mileageFormatted} km`, Icon: Gauge },
    { label: "Carburant", value: car.fuel_type, Icon: Fuel },
    { label: "Boîte", value: car.transmission, Icon: Settings },
    { label: "Couleur", value: car.color ?? "—", Icon: Palette },
    { label: "Puissance", value: car.power ? `${car.power} CV` : "—", Icon: Zap },
    { label: "Moteur", value: car.engine ?? "—", Icon: CarIcon },
    { label: "Portes", value: String(car.doors), Icon: DoorOpen },
  ];

  const { confort, securite, multimedia } = groupCarFeatures(car.features);

  const featureSections: { title: string; items: string[] }[] = [
    { title: "Confort", items: confort },
    { title: "Sécurité", items: securite },
    { title: "Multimédia", items: multimedia },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={productJsonLd(car)} />
      <Navbar />

      {/* Hero pleine largeur */}
      <header className="relative h-[480px] w-full overflow-hidden bg-[#111111]">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#2a2a2a] text-[#888888]">
            Pas d&apos;image
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-6xl px-4 pb-10 pt-24 md:px-6">
          <h1 className="font-[var(--font-display)] max-w-4xl text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.1] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {car.brand} {car.model} {car.year}
          </h1>
          <p className="font-[var(--font-display)] mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {priceFormatted}
            <span className="ml-1.5 text-[1.5rem] font-semibold text-[#CC1414] md:text-[1.75rem]">TND</span>
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-12">
            {/* Colonne gauche */}
            <div className="min-w-0 space-y-10">
              <section aria-label="Galerie photos">
                <CarGallery images={car.images} alt={`${car.brand} ${car.model}`} />
              </section>

              <section aria-label="Caractéristiques">
                <h2 className="font-[var(--font-display)] mb-5 text-[28px] font-medium text-[#0D0D0D]">
                  Caractéristiques
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {specPills.map(({ label, value, Icon }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[#E0DDD8] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                    >
                      <div className="mb-3 flex items-center gap-2 text-[#6B6B6B]">
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                        <span className="font-[var(--font-body)] text-[11px] font-medium uppercase tracking-widest">
                          {label}
                        </span>
                      </div>
                      <p className="font-[var(--font-body)] text-[15px] font-medium leading-snug text-[#0D0D0D]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {featureSections.length > 0 ? (
                <section aria-label="Équipements">
                  <h2 className="font-[var(--font-display)] mb-5 text-[28px] font-medium text-[#0D0D0D]">
                    Équipements
                  </h2>
                  <div className="space-y-8">
                    {featureSections.map((section) => (
                      <div key={section.title}>
                        <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
                          {section.title}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {section.items.map((feature) => (
                            <li
                              key={feature}
                              className="font-[var(--font-body)] inline-flex items-center gap-2 rounded-full border border-[#E0DDD8] bg-white px-3 py-2 text-[13px] text-[#0D0D0D]"
                            >
                              <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section aria-label="Description">
                <h2 className="font-[var(--font-display)] mb-5 text-[28px] font-medium text-[#0D0D0D]">
                  Description
                </h2>
                <div className="rounded-xl border border-[#E0DDD8] border-l-4 border-l-[#CC1414] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                  <p className="font-[var(--font-body)] text-[15px] leading-relaxed text-[#6B6B6B]">
                    {car.description ?? "Aucune description pour ce véhicule."}
                  </p>
                </div>
              </section>
            </div>

            {/* Colonne droite — sticky */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[#E0DDD8] bg-white p-6 shadow-md">
                <p className="font-[var(--font-display)] text-[40px] font-medium leading-none text-[#0D0D0D]">
                  {priceFormatted}
                  <span className="ml-1.5 text-[1.5rem] font-semibold text-[#CC1414]">TND</span>
                </p>
                <div className="mt-4">{statusBadge(car.status)}</div>
                <div className="my-6 h-px w-full bg-[#E0DDD8]" />
                <h3 className="font-[var(--font-body)] mb-3 text-[15px] font-semibold text-[#0D0D0D]">
                  Je suis intéressé
                </h3>
                <CarLeadForm car={car} hideHeading />
              </div>
            </aside>
          </div>
        </div>

        {/* Voitures similaires — style homepage */}
        <section className="w-full bg-[#F8F7F5] py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
                  VOUS POURRIEZ AUSSI AIMER
                </p>
                <h2 className="font-[var(--font-display)] mb-5 text-[40px] font-medium leading-tight text-[#0D0D0D] md:mb-0 md:text-[52px]">
                  Voitures similaires
                </h2>
              </div>
              <p className="font-[var(--font-body)] max-w-[400px] text-[15px] leading-relaxed text-[#6B6B6B]">
                D&apos;autres modèles dans la même gamme de prix ou de marque.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {similarCars.map((similarCar, index) => (
                <CarCard key={similarCar.id} car={similarCar} index={index} skipEntrance />
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/voitures"
                className="group font-[var(--font-body)] relative inline-flex items-center gap-1 text-[14px] font-semibold text-[#0D0D0D]"
              >
                <span className="relative">
                  Explorer tout le catalogue
                  <span
                    aria-hidden
                    className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                  <span
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#0D0D0D] transition-transform duration-300 ease-out group-hover:scale-x-100"
                    aria-hidden
                  />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
