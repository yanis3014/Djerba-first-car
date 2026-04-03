"use client";

import type { KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car as CarIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { Car } from "@/lib/types";

interface CarCardProps {
  car: Car;
  view?: "grid" | "list";
  index?: number;
  /** Désactive l’entrée Framer pour laisser un parent (ex. grille accueil) gérer le stagger */
  skipEntrance?: boolean;
}

export default function CarCard({
  car,
  view = "grid",
  index = 0,
  skipEntrance = false,
}: CarCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const price = new Intl.NumberFormat("fr-FR").format(car.price);
  const mileage = new Intl.NumberFormat("fr-FR").format(car.mileage);
  const image = car.cover_image ?? car.images[0] ?? "";
  const status = useMemo(() => {
    if (car.status === "sold") return { label: "VENDU", classes: "border-[#111111] bg-[#111111] text-white" };
    if (car.status === "reserved") return { label: "RESERVE", classes: "border-[#CC1414] bg-white text-[#CC1414]" };
    return { label: "DISPONIBLE", classes: "border-[#E0DDD8] bg-white text-[#0D0D0D]" };
  }, [car.status]);

  const sharedClass = `group h-full cursor-pointer overflow-hidden rounded-[12px] border border-[#E0DDD8] bg-white transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[6px] hover:border-[#CC1414] hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] ${
    view === "list" ? "grid gap-4 md:grid-cols-[280px_1fr]" : "flex flex-col"
  }`;

  const interaction = {
    onClick: () => router.push(`/voitures/${car.slug}`),
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        router.push(`/voitures/${car.slug}`);
      }
    },
    role: "link" as const,
    tabIndex: 0,
    "aria-label": `Voir le detail de ${car.brand} ${car.model}`,
  };

  const inner = (
    <>
      <div className={`relative aspect-[4/3] overflow-hidden ${view === "list" ? "h-full min-h-[260px]" : ""}`}>
        {image && !imageError ? (
          <Image
            src={image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover transition-transform duration-[500ms] ease-in-out group-hover:scale-[1.04]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F3F3F3] text-[#CCCCCC]">
            <CarIcon className="h-9 w-9 text-[#CCCCCC]" />
            <span className="text-xs">Image indisponible</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(0,0,0,0.3)] to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-[#E0DDD8] bg-white px-3 py-1 text-[11px] uppercase tracking-wider text-black">
          {car.fuel_type}
        </div>
        <div className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[11px] ${status.classes}`}>
          {status.label}
        </div>
      </div>

      <div className="px-6 pb-6 pt-5">
        <h3 className="font-[var(--font-display)] text-[22px] font-semibold text-[#0D0D0D] transition-colors duration-300 group-hover:text-[#CC1414]">
          {car.brand} {car.model}
        </h3>
        <p className="mt-1.5 font-[var(--font-body)] text-[13px] text-[#6B6B6B]">
          {car.year} • {mileage} km • {car.transmission}
        </p>
        <div className="my-4 h-px w-full bg-[#F0EDE8]" />
        <div className="flex items-center justify-between">
          <p className="font-[var(--font-body)] text-[24px] font-bold text-[#0D0D0D]">
            {price}
            <span className="text-[14px] font-medium text-[#CC1414]"> TND</span>
          </p>
          <Link
            href={`/voitures/${car.slug}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#CC1414]"
          >
            Voir <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </>
  );

  if (skipEntrance) {
    return (
      <article className={sharedClass} {...interaction}>
        {inner}
      </article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={sharedClass}
      {...interaction}
    >
      {inner}
    </motion.article>
  );
}
