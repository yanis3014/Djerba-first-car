import type { Metadata } from "next";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import CarCard from "@/components/public/CarCard";
import CatalogFilters from "@/components/public/CatalogFilters";
import { getAllCars } from "@/lib/cars";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catalogue",
  description: `Parcourez les véhicules disponibles — ${SITE_NAME}, Djerba.`,
  openGraph: {
    title: `Catalogue | ${SITE_NAME}`,
    description: "Filtres par marque, prix, carburant et année.",
  },
};

interface CatalogPageProps {
  searchParams: {
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
    page?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const cars = await getAllCars();
  const query = (searchParams.q ?? "").toLowerCase();
  const brand = searchParams.brand ?? "";
  const fuel = searchParams.fuel ?? "";
  const transmission = searchParams.transmission ?? "";
  const minPrice = Number(searchParams.minPrice ?? 0);
  const maxPrice = Number(searchParams.maxPrice ?? Number.MAX_SAFE_INTEGER);
  const minYear = Number(searchParams.minYear ?? 0);
  const maxYear = Number(searchParams.maxYear ?? 3000);
  const sort = searchParams.sort ?? "recent";
  const view = searchParams.view === "list" ? "list" : "grid";
  const page = Number(searchParams.page ?? 1);

  let filtered = cars.filter((car) => {
    const matchesQuery = `${car.brand} ${car.model}`.toLowerCase().includes(query);
    const matchesBrand = !brand || car.brand === brand;
    const matchesFuel = !fuel || car.fuel_type === fuel;
    const matchesTransmission = !transmission || car.transmission === transmission;
    const matchesPrice = car.price >= minPrice && car.price <= maxPrice;
    const matchesYear = car.year >= minYear && car.year <= maxYear;
    return matchesQuery && matchesBrand && matchesFuel && matchesTransmission && matchesPrice && matchesYear;
  });

  filtered = filtered.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "mileage-asc") return a.mileage - b.mileage;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const brands = Array.from(new Set(cars.map((car) => car.brand))).sort();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-accent)]">Catalogue des voitures</h1>

        <div className="mt-6">
          <CatalogFilters
            brands={brands}
            defaults={{
              q: searchParams.q,
              brand,
              fuel,
              transmission,
              minPrice: searchParams.minPrice,
              maxPrice: searchParams.maxPrice,
              minYear: searchParams.minYear,
              maxYear: searchParams.maxYear,
              sort,
              view,
            }}
          />
        </div>

        <div className={`mt-6 grid gap-4 ${view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
          {paginated.map((car, index) => (
            <CarCard key={car.id} car={car} view={view} index={index} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a href={`?${new URLSearchParams({ ...searchParams, page: String(Math.max(1, safePage - 1)) })}`} className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm">
            Precedent
          </a>
          <span className="text-sm text-[var(--color-muted)]">Page {safePage} / {totalPages}</span>
          <a href={`?${new URLSearchParams({ ...searchParams, page: String(Math.min(totalPages, safePage + 1)) })}`} className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm">
            Suivant
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
