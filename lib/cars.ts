import { createSupabaseServerClient } from "@/lib/supabase";
import type { Car } from "@/lib/types";

const fallbackCars: Car[] = [
  {
    id: "1",
    slug: "bmw-serie-3-2021",
    brand: "BMW",
    model: "Serie 3",
    year: 2021,
    price: 115000,
    mileage: 48000,
    fuel_type: "Diesel",
    transmission: "Automatique",
    color: "Noir",
    engine: "2.0",
    power: 190,
    doors: 4,
    condition: "used",
    status: "available",
    description: "Berline premium tres bien entretenue, premiere main.",
    features: ["GPS", "Bluetooth", "Camera de recul", "ABS"],
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop"],
    cover_image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop",
    is_featured: true,
    views: 121,
    created_at: "2026-01-10T08:00:00.000Z",
    updated_at: "2026-01-10T08:00:00.000Z",
  },
  {
    id: "2",
    slug: "mercedes-classe-c-2020",
    brand: "Mercedes",
    model: "Classe C",
    year: 2020,
    price: 102000,
    mileage: 62000,
    fuel_type: "Essence",
    transmission: "Automatique",
    color: "Gris",
    engine: "1.8",
    power: 156,
    doors: 4,
    condition: "used",
    status: "available",
    description: "Vehicule confortable et elegant, ideal usage quotidien.",
    features: ["Apple CarPlay", "Airbags", "ESP"],
    images: ["https://images.unsplash.com/photo-1617814076668-8df173af8658?w=1200&auto=format&fit=crop"],
    cover_image: "https://images.unsplash.com/photo-1617814076668-8df173af8658?w=1200&auto=format&fit=crop",
    is_featured: true,
    views: 89,
    created_at: "2026-01-11T08:00:00.000Z",
    updated_at: "2026-01-11T08:00:00.000Z",
  },
  {
    id: "3",
    slug: "audi-a4-2019",
    brand: "Audi",
    model: "A4",
    year: 2019,
    price: 89000,
    mileage: 73000,
    fuel_type: "Diesel",
    transmission: "Manuelle",
    color: "Blanc",
    engine: "2.0 TDI",
    power: 150,
    doors: 4,
    condition: "used",
    status: "available",
    description: "Etat excellent, entretien regulier, pneus neufs.",
    features: ["GPS", "Climatisation", "Capteurs de stationnement"],
    images: ["https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200&auto=format&fit=crop"],
    cover_image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200&auto=format&fit=crop",
    is_featured: false,
    views: 64,
    created_at: "2026-01-12T08:00:00.000Z",
    updated_at: "2026-01-12T08:00:00.000Z",
  },
];

export async function getAllCars(): Promise<Car[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return fallbackCars;
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });
    if (error || !data) return fallbackCars;
    return data as Car[];
  } catch {
    return fallbackCars;
  }
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const cars = await getAllCars();
  return cars.find((car) => car.slug === slug) ?? null;
}

export async function getCarById(id: string): Promise<Car | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const cars = await getAllCars();
      return cars.find((c) => c.id === id) ?? null;
    }
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("cars").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return data as Car;
  } catch {
    return null;
  }
}
