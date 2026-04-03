"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import type { Car } from "@/lib/types";
import CarCard from "@/components/public/CarCard";
import { getWhatsAppHref } from "@/lib/whatsapp";

const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.5!2d10.8505!3d33.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDUyJzU5LjkiTiAxMMKwNTEnMDEuOCJF!5e0!3m2!1sfr!2stn!4v1234567890";

const MAPS_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=Djerba+Houmt+Essouk%2C+Route+Midoun+Km+2";

function openWhatsApp() {
  const href = getWhatsAppHref();
  if (href === "#whatsapp") return;
  window.open(href, "_blank", "noopener,noreferrer");
}

function StatItem({
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
      className={`flex h-[120px] flex-1 flex-col items-center justify-center px-4 ${
        showLine ? "border-l border-[#333333]" : ""
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
        className="font-[var(--font-display)] text-[52px] leading-none text-white"
        style={{ fontWeight: 500 }}
      >
        {count}
        {suffix}
      </p>
      <p className="font-[var(--font-body)] mt-2 text-center text-[12px] font-normal uppercase tracking-widest text-[#999999]">
        {label}
      </p>
    </div>
  );
}

export default function HomePageContent({ featuredCars }: { featuredCars: Car[] }) {
  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });

  const featuredRef = useRef<HTMLElement>(null);
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 });

  const servicesRef = useRef<HTMLElement>(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 });

  const whyRef = useRef<HTMLElement>(null);
  const whyInView = useInView(whyRef, { once: true, amount: 0.15 });

  const ctaRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.35 });

  const processRef = useRef<HTMLElement>(null);
  const processInView = useInView(processRef, { once: true, amount: 0.2 });

  const locationRef = useRef<HTMLElement>(null);
  const locationInView = useInView(locationRef, { once: true, amount: 0.15 });

  const services = [
    {
      num: "01",
      title: "Vente",
      description:
        "Notre stock de véhicules soigneusement sélectionnés vous attend. Chaque voiture est inspectée, préparée et prête à vous séduire.",
    },
    {
      num: "02",
      title: "Achat",
      description:
        "Vous souhaitez vendre votre véhicule ? Nous vous proposons une estimation rapide, honnête et une offre claire sous 24h.",
    },
    {
      num: "03",
      title: "Échange",
      description:
        "Changez de voiture en toute simplicité. Nous reprenons votre ancien véhicule et vous accompagnons vers votre prochain coup de cœur.",
    },
  ];

  const trustPoints = [
    {
      title: "Véhicules inspectés",
      description:
        "Chaque voiture passe par un contrôle technique rigoureux avant d'intégrer notre stock.",
    },
    {
      title: "Prix transparents",
      description:
        "Nos tarifs sont clairs, justifiés et sans frais cachés. Vous savez exactement ce que vous payez.",
    },
    {
      title: "Accompagnement administratif",
      description:
        "Nous gérons les démarches administratives de A à Z : carte grise, mutation, assurance.",
    },
    {
      title: "Service après-vente",
      description:
        "Notre relation ne s'arrête pas à la vente. Nous restons disponibles pour vous accompagner après l'achat.",
    },
  ];

  const steps = [
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
      description:
        "Venez découvrir le véhicule sur place à Djerba, Route Midoun Km2.",
    },
    {
      title: "Roulez",
      description:
        "Finalisez votre achat et prenez la route avec votre nouveau véhicule.",
    },
  ];

  const waHref = getWhatsAppHref();

  return (
    <>
      {/* SECTION 1 — STATS */}
      <section
        ref={statsRef}
        className="w-full bg-[#111111]"
        aria-label="Chiffres clés"
      >
        <div className="mx-auto flex max-w-6xl">
          <StatItem
            target={50}
            suffix="+"
            label="Voitures en stock"
            inView={statsInView}
            showLine={false}
          />
          <StatItem
            target={5}
            suffix=""
            label="Ans d'expérience"
            inView={statsInView}
            showLine
          />
          <StatItem
            target={500}
            suffix="+"
            label="Clients satisfaits"
            inView={statsInView}
            showLine
          />
        </div>
      </section>

      {/* SECTION 2 — VEDETTE */}
      <section ref={featuredRef} className="w-full bg-[#F8F7F5] py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
                SÉLECTION DU MOMENT
              </p>
              <h2 className="font-[var(--font-display)] max-w-xl text-[52px] font-medium leading-tight text-[#0D0D0D]">
                Nos véhicules en vedette
              </h2>
            </div>
            <p className="font-[var(--font-body)] max-w-[400px] text-[15px] leading-relaxed text-[#6B6B6B]">
              Une sélection rigoureuse de véhicules disponibles immédiatement à
              Djerba.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                  delay: index * 0.15,
                }}
              >
                <CarCard car={car} skipEntrance />
              </motion.div>
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

      {/* SECTION 3 — SERVICES */}
      <section ref={servicesRef} className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
              CE QUE NOUS FAISONS
            </p>
            <h2 className="font-[var(--font-display)] text-[52px] font-medium leading-tight text-[#0D0D0D]">
              Trois façons de vous servir
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3">
            {services.map((service, index) => (
              <motion.article
                key={service.num}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.55,
                  ease: "easeOut",
                  delay: index * 0.12,
                }}
                className={`group border-[#E0DDD8] pb-12 md:border-b-0 md:pb-0 ${index < 2 ? "border-b md:border-b-0" : ""} ${index > 0 ? "md:border-l md:border-[#E0DDD8]" : ""} ${index === 0 ? "md:pr-12" : ""} ${index === 1 ? "md:px-12" : ""} ${index === 2 ? "md:pl-12" : ""}`}
              >
                <p className="font-[var(--font-display)] mb-2 text-[100px] leading-none text-[#F0EDED] transition-colors duration-300 ease-out group-hover:text-[#CC1414]">
                  {service.num}
                </p>
                <h3 className="font-[var(--font-body)] mb-3 text-[22px] font-bold text-[#0D0D0D]">
                  {service.title}
                </h3>
                <p className="font-[var(--font-body)] mb-6 text-[15px] leading-[1.7] text-[#6B6B6B]">
                  {service.description}
                </p>
                <Link
                  href="/services"
                  className="group/link font-[var(--font-body)] inline-flex items-center gap-1 text-[13px] font-semibold text-[#CC1414]"
                >
                  En savoir plus
                  <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                    →
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — POURQUOI */}
      <section ref={whyRef} className="w-full bg-[#F8F7F5] py-24">
        <div className="mx-auto grid max-w-6xl gap-16 px-4 md:grid-cols-[45%_55%] md:gap-12 md:px-6">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={
              whyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -36 }
            }
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative"
          >
            <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
              NOTRE ENGAGEMENT
            </p>
            <h2 className="font-[var(--font-display)] text-[44px] font-medium leading-tight text-[#0D0D0D]">
              La confiance, au cœur de chaque transaction
            </h2>
            <p className="font-[var(--font-body)] mt-6 max-w-[380px] text-[15px] leading-relaxed text-[#6B6B6B]">
              Depuis 5 ans, Djerba First Car accompagne les particuliers et
              professionnels dans leurs projets automobiles avec rigueur et
              transparence.
            </p>
            <div className="relative mt-14 min-h-[140px]">
              <p className="font-[var(--font-display)] absolute bottom-0 left-0 text-[120px] leading-none text-[#F0EDED]">
                5
              </p>
              <p className="font-[var(--font-body)] relative z-10 pt-16 text-[14px] text-[#0D0D0D]">
                ans d&apos;expérience
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={
              whyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 36 }
            }
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="space-y-0"
          >
            {trustPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                animate={
                  whyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: 0.1 + index * 0.1,
                }}
                className={`flex gap-4 py-6 ${index > 0 ? "border-t border-[#E0DDD8]" : ""}`}
              >
                <span
                  className="font-[var(--font-display)] shrink-0 text-[32px] leading-none text-[#CC1414]"
                  aria-hidden
                >
                  [
                </span>
                <div>
                  <p className="font-[var(--font-body)] text-[16px] font-bold text-[#0D0D0D]">
                    {point.title}
                  </p>
                  <p className="font-[var(--font-body)] mt-2 text-[14px] leading-relaxed text-[#6B6B6B]">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — WHATSAPP CTA */}
      <section
        ref={ctaRef}
        className="relative w-full overflow-hidden bg-[#111111] py-16"
        aria-label="Contact WhatsApp"
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 max-w-md"
          style={{
            background:
              "radial-gradient(circle at center, rgba(204,20,20,0.15) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-[var(--font-body)] text-[11px] font-medium uppercase tracking-widest text-white">
              RÉPONSE EN QUELQUES MINUTES
            </p>
            <h2 className="font-[var(--font-display)] mt-3 text-[40px] font-medium leading-tight text-white">
              Une question sur un véhicule ?
            </h2>
            <p className="font-[var(--font-body)] mt-3 max-w-xl text-[15px] leading-relaxed text-[#999999]">
              Notre équipe est disponible sur WhatsApp pour vous conseiller,
              répondre à vos questions et organiser une visite.
            </p>
          </motion.div>

          <motion.div
            className="relative flex flex-col items-center md:items-end"
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <button
              type="button"
              onClick={openWhatsApp}
              className="font-[var(--font-body)] inline-flex items-center gap-2 rounded-full border border-black bg-white px-8 py-4 text-[15px] font-semibold text-black transition-colors duration-300 hover:border-[#CC1414] hover:bg-[#CC1414] hover:text-white"
            >
              <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2} />
              Contacter sur WhatsApp
            </button>
            <p className="font-[var(--font-body)] mt-3 text-center text-[12px] text-[#666666]">
              Lun–Sam 8h–18h • Dim 9h–14h
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — PROCESSUS */}
      <section ref={processRef} className="w-full bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
              LE PROCESSUS
            </p>
            <h2 className="font-[var(--font-display)] text-[52px] font-medium leading-tight text-[#0D0D0D]">
              Simple, rapide, transparent
            </h2>
          </div>

          <div className="mt-16 flex flex-col gap-10 md:flex-row md:items-start md:gap-0">
            {steps.map((step, index) => (
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
                    delay: index * 0.2,
                  }}
                  className="flex-1 text-center md:text-left"
                >
                  <p className="font-[var(--font-display)] text-[72px] font-normal leading-none text-[#CC1414]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-[var(--font-body)] mt-2 text-[18px] font-bold text-[#0D0D0D]">
                    {step.title}
                  </h3>
                  <p className="font-[var(--font-body)] mx-auto mt-2 max-w-[200px] text-[14px] leading-relaxed text-[#6B6B6B] md:mx-0">
                    {step.description}
                  </p>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="hidden h-[120px] flex-[0.4] items-center px-2 md:flex">
                    <motion.div
                      className="h-px w-full border-t border-dashed border-[#CC1414]"
                      initial={{ scaleX: 0 }}
                      animate={
                        processInView ? { scaleX: 1 } : { scaleX: 0 }
                      }
                      transition={{
                        duration: 0.55,
                        ease: "easeOut",
                        delay: index * 0.2 + 0.15,
                      }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — LOCALISATION */}
      <section ref={locationRef} className="w-full bg-[#F8F7F5] py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2 lg:gap-10 lg:px-6">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={
              locationInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -32 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-2xl border border-[#E0DDD8] bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          >
            <p className="font-[var(--font-body)] mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#CC1414]">
              NOUS TROUVER
            </p>
            <h2 className="font-[var(--font-display)] text-[36px] font-medium leading-tight text-[#0D0D0D]">
              Venez nous rendre visite
            </h2>
            <div className="my-6 h-px w-full bg-[#E0DDD8]" />

            <ul className="space-y-5">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#CC1414]"
                  strokeWidth={1.75}
                />
                <span className="font-[var(--font-body)] text-[15px] text-[#0D0D0D]">
                  Djerba Houmt Essouk, Route Midoun Km2
                </span>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#CC1414]"
                  strokeWidth={1.75}
                />
                <a
                  href="tel:+21600000000"
                  className="font-[var(--font-body)] text-[15px] text-[#0D0D0D] underline-offset-2 hover:underline"
                >
                  +216 XX XXX XXX
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#CC1414]"
                  strokeWidth={1.75}
                />
                <a
                  href={waHref === "#whatsapp" ? "#" : waHref}
                  className="font-[var(--font-body)] text-[15px] text-[#CC1414] underline-offset-2 hover:underline"
                  {...(waHref === "#whatsapp" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  WhatsApp disponible
                </a>
              </li>
              <li className="flex gap-3">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#CC1414]"
                  strokeWidth={1.75}
                />
                <span className="font-[var(--font-body)] text-[15px] text-[#6B6B6B]">
                  Lun–Sam : 8h00–18h00 • Dim : 9h00–14h00
                </span>
              </li>
            </ul>

            <a
              href={MAPS_DIRECTIONS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[var(--font-body)] mt-8 inline-flex w-full items-center justify-center rounded-md bg-[#CC1414] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#a80f0f]"
            >
              Obtenir l&apos;itinéraire
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={
              locationInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
            className="min-h-[450px] overflow-hidden rounded-2xl border border-[#E0DDD8]"
          >
            <iframe
              title="Carte — Djerba First Car"
              src={MAPS_EMBED_SRC}
              className="h-full min-h-[450px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
