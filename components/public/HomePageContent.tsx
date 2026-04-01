"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  Banknote,
  MessageCircle,
  Phone,
  ShoppingCart,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import type { Car } from "@/lib/types";
import CarCard from "@/components/public/CarCard";
import HomeHero from "@/components/public/HomeHero";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function openWhatsApp() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const clean = number.replace(/\D/g, "");
  if (typeof window !== "undefined") {
    window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer");
  }
}

export default function HomePageContent({ featuredCars }: { featuredCars: Car[] }) {
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.25 });
  const whyRef = useRef<HTMLDivElement | null>(null);
  const whyInView = useInView(whyRef, { once: true, amount: 0.2 });
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.25 });
  const locationRef = useRef<HTMLDivElement | null>(null);
  const locationInView = useInView(locationRef, { once: true, amount: 0.2 });

  const services = useMemo(
    () => [
      {
        icon: ShoppingCart,
        title: "Vente",
        description: "Des vehicules premium pret a prendre la route des aujourd'hui.",
      },
      {
        icon: Banknote,
        title: "Achat",
        description: "Nous reprenons votre voiture avec une estimation claire et rapide.",
      },
      {
        icon: ArrowLeftRight,
        title: "Echange",
        description: "Passez a un modele superieur avec un accompagnement complet.",
      },
    ],
    [],
  );

  const steps = [
    {
      title: "Parcourez notre catalogue en ligne",
      text: "Decouvrez nos offres en quelques clics.",
    },
    {
      title: "Contactez-nous par WhatsApp ou telephone",
      text: "Notre equipe repond rapidement a vos questions.",
    },
    {
      title: "Venez voir le vehicule a Djerba",
      text: "Inspection et essai sur place en toute transparence.",
    },
    {
      title: "Finalisez l'achat ou l'echange sereinement",
      text: "Nous vous accompagnons jusqu'a la remise des cles.",
    },
  ];

  return (
    <>
      <HomeHero />

      <AnimatedSection className="w-full bg-[var(--color-bg)]">
        <motion.div
          ref={featuredRef}
          className="mx-auto w-full max-w-6xl px-4 py-14"
          initial={{ opacity: 0 }}
          animate={featuredInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
        >
          <motion.p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
            SELECTION PREMIUM
          </motion.p>
          <motion.h2 className="mt-2 font-[var(--font-display)] text-[40px] leading-tight text-[var(--color-text)] md:text-[48px]">
            Nos vehicules en vedette
          </motion.h2>
          <motion.p className="mt-2 text-[var(--color-muted)]">
            Une selection premium disponible immediatement a Djerba
          </motion.p>
          <motion.div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </motion.div>
          <motion.div className="mt-8 text-center">
            <Link
              href="/voitures"
              className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-6 py-3 font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Voir tout le catalogue →
            </Link>
          </motion.div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection className="w-full bg-[var(--color-surface)]">
        <motion.div className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="font-[var(--font-display)] text-[44px] text-[var(--color-text)]">Ce que nous faisons</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className={`group px-0 md:px-12 ${index < 2 ? "md:border-r md:border-[var(--color-accent)]/35" : ""}`}>
                  <div className="relative">
                    <p className="font-[var(--font-display)] text-[80px] leading-none text-[#F0EDED] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="-mt-8 font-[var(--font-body)] text-[24px] font-bold text-[var(--color-text)]">{service.title}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--color-muted)]">{service.description}</p>
                    <Icon className="mt-5 h-6 w-6 text-[var(--color-accent)]" />
                  </div>
                </article>
              );
            })}
          </div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection className="w-full bg-[var(--color-bg-alt)]">
        <div ref={whyRef} className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <h2 className="font-[var(--font-display)] text-4xl text-[var(--color-text)] md:text-5xl">
              Pourquoi choisir Djerba First Car ?
            </h2>
            <p className="mt-4 max-w-xl text-[var(--color-muted)]">
              Notre equipe locale vous propose une experience claire, rapide et premium pour acheter, vendre ou echanger votre vehicule.
            </p>
            <Link href="/services" className="mt-5 inline-block text-[var(--color-accent)] hover:underline">
              En savoir plus
            </Link>
          </div>
          <div className="space-y-4">
            {[
              "Vehicules inspectes et certifies",
              "Prix transparents sans surprises",
              "Accompagnement administratif complet",
              "5 ans d'experience a Djerba",
            ].map((item, index) => (
              <motion.article
                key={item}
                initial={{ opacity: 0, x: -24 }}
                animate={whyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="border-l-[3px] border-[var(--color-accent)] pl-4">
                  <p className="text-[var(--color-text)]">{item}</p>
                  <p className="text-sm text-[var(--color-muted)]">Service professionnel et suivi personnalise.</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full bg-[var(--color-surface-dark)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 lg:flex-row">
          <div className="flex items-center gap-3 text-white">
            <motion.div
              className="relative flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "radial-gradient(circle, rgba(204,20,20,0.3) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageCircle className="h-7 w-7" />
            </motion.div>
            <p className="text-lg font-medium">
              Une question ? On vous repond en quelques minutes sur WhatsApp
            </p>
          </div>
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-3 font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            <MessageCircle className="h-5 w-5" />
            Contacter sur WhatsApp
          </button>
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full bg-[var(--color-surface)]">
        <div ref={timelineRef} className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="font-[var(--font-display)] text-4xl text-[var(--color-text)]">
            Un processus simple et transparent
          </h2>
          <motion.div
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={timelineInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-6 hidden h-px w-full border-t border-dashed border-[var(--color-accent)] md:block"
          />
          <div className="mt-8 grid gap-6 md:auto-rows-fr md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <article className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="font-[var(--font-display)] text-[48px] leading-none text-[var(--color-accent)]">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 min-h-[52px] text-base text-[var(--color-text)]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{step.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full bg-[var(--color-bg-alt)]">
        <div ref={locationRef} className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={locationInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
          >
            <h2 className="font-[var(--font-display)] text-4xl text-[var(--color-text)]">Nous trouver</h2>
            <p className="mt-4 text-[var(--color-muted)]">📍 Djerba Houmt Essouk, Route Midoun Km2</p>
            <p className="mt-2 flex items-center gap-2 text-[var(--color-muted)]">
              <Phone className="h-4 w-4 text-[var(--color-accent)]" />
              +216 XX XXX XXX
            </p>
            <button
              type="button"
              onClick={openWhatsApp}
              className="mt-2 flex items-center gap-2 text-[var(--color-accent)] hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              <span className="text-[var(--color-muted)]">Lun-Sam:</span>
              <span>8h00 - 18h00</span>
              <span className="text-[var(--color-muted)]">Dimanche:</span>
              <span>9h00 - 14h00</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={locationInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="overflow-hidden rounded-[12px] border-2 border-[var(--color-border)]"
          >
            <iframe
              title="Djerba Houmt Essouk Route Midoun"
              src="https://maps.google.com/maps?q=Djerba%20Houmt%20Essouk%20Route%20Midoun&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-[400px] w-full"
              loading="lazy"
            />
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
