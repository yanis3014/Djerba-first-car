"use client";

import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import {
  ArrowLeftRight,
  BadgeCheck,
  Banknote,
  FileCheck,
  Shield,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import { getWhatsAppHref } from "@/lib/whatsapp";

const services = [
  {
    icon: ShoppingCart,
    title: "Vente de voitures",
    description:
      "Selection premium de vehicules verifies, prepares et disponibles immediatement.",
  },
  {
    icon: Banknote,
    title: "Achat de votre vehicule",
    description:
      "Estimation rapide et offre claire avec accompagnement administratif complet.",
  },
  {
    icon: ArrowLeftRight,
    title: "Echange",
    description:
      "Changez de vehicule en toute simplicite avec reprise de votre ancienne voiture.",
  },
];

const steps = [
  "Vous nous contactez",
  "On evalue votre besoin",
  "On trouve la solution",
  "Vous repartez satisfait",
];

const trustItems = [
  { icon: Shield, title: "Vehicules verifies" },
  { icon: FileCheck, title: "Accompagnement administratif" },
  { icon: BadgeCheck, title: "Prix transparents" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" as const },
  viewport: { once: true, amount: 0.25 },
};

export function ServicesPageContent() {
  const whatsappCta = getWhatsAppHref("Bonjour Djerba First Car, je souhaite en savoir plus sur vos services.");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <motion.section
          initial={fadeInUp.hidden}
          whileInView={fadeInUp.whileInView}
          transition={fadeInUp.transition}
          viewport={fadeInUp.viewport}
          className="flex h-[200px] w-full items-center justify-center border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4"
        >
          <div className="text-center">
            <h1 className="font-[var(--font-display)] text-5xl text-[var(--color-accent)] md:text-6xl">
              Nos Services
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)] md:text-base">
              Vente, achat et echange de vehicules premium a Djerba
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={fadeInUp.hidden}
          whileInView={fadeInUp.whileInView}
          transition={fadeInUp.transition}
          viewport={fadeInUp.viewport}
          className="mx-auto w-full max-w-6xl px-4 py-12"
        >
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="flex min-h-[320px] flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8"
                >
                  <div className="mb-5 w-fit rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3">
                    <Icon className="h-7 w-7 text-[var(--color-accent)]" />
                  </div>
                  <h2 className="text-2xl text-[var(--color-text)]">{service.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{service.description}</p>
                  <a
                    href="/contact"
                    className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-[var(--color-accent)] hover:underline"
                  >
                    En savoir plus
                  </a>
                </article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={fadeInUp.hidden}
          whileInView={fadeInUp.whileInView}
          transition={fadeInUp.transition}
          viewport={fadeInUp.viewport}
          className="mx-auto w-full max-w-6xl px-4 py-8"
        >
          <h2 className="font-[var(--font-display)] text-4xl text-[var(--color-accent)]">
            Comment ca marche ?
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)] text-sm font-semibold text-[var(--color-accent)]">
                  {index + 1}
                </div>
                <p className="text-sm text-[var(--color-muted)]">{step}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={fadeInUp.hidden}
          whileInView={fadeInUp.whileInView}
          transition={fadeInUp.transition}
          viewport={fadeInUp.viewport}
          className="mx-auto w-full max-w-6xl px-4 py-8"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <Icon className="h-6 w-6 text-[var(--color-accent)]" />
                  <p className="text-sm text-[var(--color-text)]">{item.title}</p>
                </article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={fadeInUp.hidden}
          whileInView={fadeInUp.whileInView}
          transition={fadeInUp.transition}
          viewport={fadeInUp.viewport}
          className="mt-8 w-full bg-[var(--color-surface-dark)] px-4 py-10"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <h3 className="text-3xl font-semibold text-white">Pret a commencer ?</h3>
            <a
              href={whatsappCta}
              className="rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
