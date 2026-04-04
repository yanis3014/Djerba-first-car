"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

import { useSiteSettings } from "@/components/public/SiteSettingsProvider";

const SERVICES = [
  {
    num: "01",
    label: "VENTE",
    title: "Trouvez le véhicule qui vous correspond",
    description:
      "Notre stock est renouvelé en permanence avec des véhicules rigoureusement sélectionnés, inspectés et préparés. Chaque voiture que vous voyez sur notre site est disponible immédiatement à Djerba.",
    bullets: [
      "Véhicules inspectés et certifiés",
      "Disponibles immédiatement",
      "Prix négociables",
    ],
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    imageAlt: "Showroom automobile premium",
    cta: { href: "/voitures", label: "Voir nos voitures" },
  },
  {
    num: "02",
    label: "ACHAT",
    title: "Vendez votre véhicule au meilleur prix",
    description:
      "Vous souhaitez vendre votre véhicule ? Notre équipe vous propose une estimation gratuite, honnête et rapide. Pas de négociation interminable : une offre claire, transparente et équitable sous 24h.",
    bullets: [
      "Estimation gratuite sous 24h",
      "Paiement rapide et sécurisé",
      "Toutes marques acceptées",
    ],
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    imageAlt: "Véhicule de prestige",
    cta: { href: "/contact", label: "Nous contacter" },
  },
  {
    num: "03",
    label: "ÉCHANGE",
    title: "Changez de véhicule en toute sérénité",
    description:
      "Profitez de notre service d'échange pour simplifier votre transition vers un nouveau véhicule. Nous reprenons votre ancien véhicule à sa juste valeur et vous accompagnons dans le choix du suivant.",
    bullets: [
      "Reprise garantie de votre véhicule",
      "Différentiel calculé honnêtement",
      "Une seule démarche pour tout gérer",
    ],
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    imageAlt: "Conduite sur route",
    cta: { href: "/contact", label: "Nous contacter" },
  },
] as const;

function useProcessSteps(address: string) {
  return useMemo(
    () =>
      [
        {
          title: "Parcourez",
          description:
            "Explorez notre catalogue en ligne et repérez vos coups de cœur.",
        },
        {
          title: "Contactez",
          description:
            "Appelez-nous ou écrivez sur WhatsApp. Réponse garantie le jour même.",
        },
        {
          title: "Visitez",
          description: `Venez découvrir le véhicule sur place — ${address}.`,
        },
        {
          title: "Roulez",
          description:
            "Finalisez votre achat et prenez la route avec votre nouveau véhicule.",
        },
      ] as const,
    [address],
  );
}

function StatLightItem({
  target,
  suffix,
  label,
  inView,
  showLine,
}: {
  target: number;
  suffix: string;
  label: string;
  inView: boolean;
  showLine: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const durationMs = 1400;
    const tickMs = 28;
    const steps = Math.max(12, Math.ceil(durationMs / tickMs));
    const increment = target / steps;
    const id = window.setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        window.clearInterval(id);
      } else {
        setCount(Math.floor(current));
      }
    }, tickMs);
    return () => window.clearInterval(id);
  }, [inView, target]);

  return (
    <div
      className={`flex min-h-[140px] flex-1 flex-col items-center justify-center px-3 md:px-4 ${
        showLine ? "border-l border-[#E0DDD8]" : ""
      }`}
    >
      <motion.div
        className="mb-3 h-[2px] w-8 bg-[#CC1414]"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
      <p
        className="font-[var(--font-display)] text-[64px] leading-none text-[#0D0D0D]"
        style={{ fontWeight: 400 }}
      >
        {count}
        {suffix}
      </p>
      <p className="font-[var(--font-body)] mt-2 text-center text-[12px] font-normal uppercase tracking-widest text-[#6B6B6B]">
        {label}
      </p>
    </div>
  );
}

function ServiceSection({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const isEven = index % 2 === 1;

  const imageFrom = isEven ? 48 : -48;
  const textFrom = isEven ? -48 : 48;

  const imageBlock = (
    <motion.div
      className="relative min-h-[280px] w-full md:min-h-[480px]"
      initial={{ opacity: 0, x: imageFrom }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: imageFrom }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={index === 0}
      />
    </motion.div>
  );

  const textBlock = (
    <motion.div
      className="relative flex min-h-[280px] flex-col justify-center bg-white px-8 py-12 md:min-h-[480px] md:px-16"
      initial={{ opacity: 0, x: textFrom }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: textFrom }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
    >
      <span
        className="font-[var(--font-display)] pointer-events-none absolute right-6 top-6 select-none text-[120px] leading-none text-[#F0EDED] md:right-10 md:top-10"
        aria-hidden
      >
        {service.num}
      </span>
      <div className="relative z-10">
        <p className="font-[var(--font-body)] text-[11px] font-medium uppercase tracking-widest text-[#CC1414]">
          {service.label}
        </p>
        <h2
          id={`service-${service.num}-title`}
          className="font-[var(--font-display)] mt-3 max-w-md text-[44px] font-normal leading-tight text-[#0D0D0D]"
        >
          {service.title}
        </h2>
        <p className="font-[var(--font-body)] mt-4 max-w-[440px] text-[15px] leading-[1.8] text-[#6B6B6B]">
          {service.description}
        </p>
        <ul className="font-[var(--font-body)] mt-6 space-y-3 text-[14px] text-[#0D0D0D]">
          {service.bullets.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CC1414] text-[10px] font-bold text-white"
                aria-hidden
              >
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href={service.cta.href}
          className="font-[var(--font-body)] mt-8 inline-flex w-fit items-center justify-center bg-[#CC1414] px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#a80f0f]"
        >
          {service.cta.label}
        </Link>
      </div>
    </motion.div>
  );

  return (
    <section
      ref={ref}
      className="grid w-full grid-cols-1 md:grid-cols-2"
      aria-labelledby={`service-${service.num}-title`}
    >
      {isEven ? (
        <>
          <div className="order-1 md:order-1">{textBlock}</div>
          <div className="order-2 md:order-2">{imageBlock}</div>
        </>
      ) : (
        <>
          <div className="order-1 md:order-1">{imageBlock}</div>
          <div className="order-2 md:order-2">{textBlock}</div>
        </>
      )}
    </section>
  );
}

export function ServicesPageContent() {
  const site = useSiteSettings();
  const processSteps = useProcessSteps(site.address);
  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });

  const processRef = useRef<HTMLElement>(null);
  const processInView = useInView(processRef, { once: true, amount: 0.2 });

  const ctaRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.35 });

  return (
    <main className="flex-1 bg-white">
        {/* SECTION 1 — HERO */}
        <header className="flex h-[320px] w-full flex-col items-center justify-center bg-[#111111] px-4 text-center">
          <p className="font-[var(--font-body)] text-[11px] font-medium uppercase tracking-[0.3em] text-[#CC1414]">
            DJERBA FIRST CAR
          </p>
          <h1 className="font-[var(--font-display)] mt-4 text-[52px] font-normal leading-none text-white md:text-[72px]">
            Nos Services
          </h1>
          <div
            className="mx-auto mt-4 h-[2px] w-12 bg-[#CC1414]"
            aria-hidden
          />
          <p className="font-[var(--font-body)] mx-auto mt-6 max-w-xl text-base text-[#999999] md:text-[16px]">
            Vente · Achat · Échange — Nous vous accompagnons à chaque étape de
            votre projet automobile.
          </p>
        </header>

        {/* SECTION 2 — SERVICES DÉTAILLÉS */}
        {SERVICES.map((service, index) => (
          <ServiceSection key={service.num} service={service} index={index} />
        ))}

        {/* SECTION 3 — CHIFFRES CLÉS */}
        <section
          ref={statsRef}
          className="w-full bg-[#F8F7F5] py-20"
          aria-label="Chiffres clés"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-4 sm:flex-row md:px-6">
            <StatLightItem
              target={50}
              suffix="+"
              label="Véhicules en stock"
              inView={statsInView}
              showLine={false}
            />
            <StatLightItem
              target={5}
              suffix=""
              label="Ans d'expérience"
              inView={statsInView}
              showLine
            />
            <StatLightItem
              target={500}
              suffix="+"
              label="Clients satisfaits"
              inView={statsInView}
              showLine
            />
            <StatLightItem
              target={24}
              suffix="h"
              label="Délai de réponse"
              inView={statsInView}
              showLine
            />
          </div>
        </section>

        {/* SECTION 4 — COMMENT ÇA MARCHE */}
        <section
          ref={processRef}
          className="w-full bg-white py-24"
          aria-labelledby="process-heading"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="max-w-3xl">
              <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
                LE PROCESSUS
              </p>
              <h2
                id="process-heading"
                className="font-[var(--font-display)] text-[40px] font-normal leading-tight text-[#0D0D0D] md:text-[52px]"
              >
                Simple, rapide, transparent
              </h2>
            </div>

            <div className="relative z-0 mt-14 md:mt-16">
              <div className="relative z-10 flex flex-col gap-12 md:flex-row md:items-start md:gap-0">
                {processSteps.map((step, index) => (
                  <Fragment key={step.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={
                        processInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 24 }
                      }
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: index * 0.12,
                      }}
                      className="relative z-10 flex-1 text-center md:text-left"
                    >
                      <p className="font-[var(--font-display)] text-[72px] font-normal leading-none text-[#CC1414] md:text-[96px]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div
                        className="mx-auto mt-2 h-px w-10 bg-[#CC1414] md:mx-0"
                        aria-hidden
                      />
                      <h3 className="font-[var(--font-body)] mt-4 text-[18px] font-bold text-[#0D0D0D]">
                        {step.title}
                      </h3>
                      <p className="font-[var(--font-body)] mx-auto mt-2 max-w-[220px] text-[14px] leading-relaxed text-[#6B6B6B] md:mx-0 md:max-w-[200px]">
                        {step.description}
                      </p>
                    </motion.div>
                    {index < processSteps.length - 1 && (
                      <div
                        className="relative z-0 hidden h-[96px] flex-[0.35] items-start justify-center pt-[48px] md:flex"
                        aria-hidden
                      >
                        <motion.div
                          className="h-px w-full border-t border-dashed border-[#CC1414]"
                          initial={{ scaleX: 0 }}
                          animate={
                            processInView ? { scaleX: 1 } : { scaleX: 0 }
                          }
                          transition={{
                            duration: 0.55,
                            ease: "easeOut",
                            delay: index * 0.12 + 0.15,
                          }}
                          style={{ transformOrigin: "left" }}
                        />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — CTA FINAL */}
        <section
          ref={ctaRef}
          className="w-full bg-[#111111] py-24"
          aria-labelledby="services-cta-heading"
        >
          <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
            <motion.h2
              id="services-cta-heading"
              className="font-[var(--font-display)] text-[40px] font-normal leading-tight text-white md:text-[56px]"
              initial={{ opacity: 0, y: 16 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5 }}
            >
              Prêt à concrétiser votre projet ?
            </motion.h2>
            <motion.p
              className="font-[var(--font-body)] mx-auto mt-4 max-w-[500px] text-[16px] text-[#999999]"
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: 0.06 }}
            >
              Contactez notre équipe dès aujourd&apos;hui. Nous sommes à votre
              disposition à Djerba.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <Link
                href="/voitures"
                className="font-[var(--font-body)] inline-flex min-w-[200px] items-center justify-center bg-white px-8 py-3.5 text-[14px] font-semibold text-black transition-colors hover:bg-[#f0f0f0]"
              >
                Voir nos voitures
              </Link>
              <Link
                href="/contact"
                className="font-[var(--font-body)] inline-flex min-w-[200px] items-center justify-center bg-[#CC1414] px-8 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#a80f0f]"
              >
                Nous contacter
              </Link>
            </motion.div>
            <motion.p
              className="font-[var(--font-body)] mt-6 text-center text-[14px] text-[#999999]"
              initial={{ opacity: 0 }}
              animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              {site.phone_display} • Lun–Sam {site.hours_weekday}
            </motion.p>
          </div>
        </section>
    </main>
  );
}
