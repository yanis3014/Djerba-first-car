import { getSiteUrl } from "@/lib/site";

export function organizationJsonLd(): Record<string, unknown> {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: "Djerba First Car",
    url,
    description: "Vente, achat et échange de véhicules premium à Djerba.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houmt Souk",
      addressRegion: "Médenine",
      addressCountry: "TN",
    },
    areaServed: {
      "@type": "Place",
      name: "Djerba",
    },
  };
}

export function productJsonLd(car: {
  brand: string;
  model: string;
  year: number;
  price: number;
  description?: string | null;
  slug: string;
  images: string[];
}): Record<string, unknown> {
  const url = `${getSiteUrl()}/voitures/${car.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.brand} ${car.model} ${car.year}`,
    description: car.description ?? `${car.brand} ${car.model} — ${car.year}`,
    ...(car.images.length ? { image: car.images } : {}),
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "TND",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}
