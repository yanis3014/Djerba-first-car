import Footer from "@/components/public/Footer";
import HomePageContent from "@/components/public/HomePageContent";
import Navbar from "@/components/public/Navbar";
import { getAllCars } from "@/lib/cars";

export default async function Home() {
  const cars = await getAllCars();
  const featuredCars = cars.filter((car) => car.is_featured).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HomePageContent featuredCars={featuredCars} />
      </main>
      <Footer />
    </div>
  );
}
