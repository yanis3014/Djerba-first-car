import type { Metadata } from "next";
import Footer from "@/components/public/Footer";
import HomePageContent from "@/components/public/HomePageContent";
import Navbar from "@/components/public/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCars } from "@/lib/cars";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accueil",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Accueil`,
    description: SITE_DESCRIPTION,
  },
};

export default async function Home() {
  const cars = await getAllCars();
  const featuredCars = cars.filter((car) => car.is_featured).slice(0, 3);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <HomePageContent featuredCars={featuredCars} />
        </main>
        <Footer />
      </div>
    </>
  );
}
