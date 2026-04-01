"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useInView, useMotionValue } from "framer-motion";

function CountUp({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = motionValue.on("change", (latest) => setDisplay(Math.round(latest)));
    return () => unsub();
  }, [motionValue]);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, { duration: 1.3, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, motionValue, value]);

  return (
    <div ref={ref} className="px-6 py-6 text-center">
      <div className="mx-auto mb-3 h-[2px] w-10 bg-[var(--color-accent)]" />
      <p className="text-3xl font-semibold text-[var(--color-accent)] md:text-4xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-[#efefef]">{label}</p>
    </div>
  );
}

export default function HomeHero() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80"
          alt="Voiture premium en showroom"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.75)_40%,rgba(0,0,0,0.3)_100%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.34'/%3E%3C/svg%3E\")",
          }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          className="relative z-10 mx-auto w-full max-w-6xl px-4 text-left"
        >
          <motion.p
            variants={item}
            className="text-[11px] uppercase tracking-[0.25em] text-white"
          >
            DJERBA • TUNISIE
          </motion.p>
          <motion.div
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="my-5 h-[60px] w-[4px] bg-[var(--color-accent)]"
          />
          <motion.h1 variants={item} className="font-[var(--font-display)] text-5xl font-semibold tracking-[0.08em] text-white md:text-7xl">
            {"VOTRE VOITURE DE REVE".split(" ").map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ y: 38 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 + index * 0.08 }}
                className="mr-3 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-3xl tracking-[0.08em] text-[var(--color-white)] md:text-4xl">
            A DJERBA
          </motion.p>
          <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-base text-[#dddddd] md:text-lg">
            Djerba First Car vous accompagne dans l&apos;achat, la vente et l&apos;echange de vehicules premium.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/voitures"
              className="rounded-md bg-[var(--color-accent)] px-6 py-3 font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Voir nos voitures
            </Link>
            <Link
              href="/contact"
              className="rounded-md bg-[var(--color-surface-dark)] px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Nous contacter
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="h-10 w-[2px] bg-white"
            animate={{ scaleY: [0.35, 1, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      <section className="w-full border-y border-[var(--color-border-dark)] bg-[#111111]">
        <div className="mx-auto grid max-w-6xl divide-y divide-[var(--color-border)] md:grid-cols-3 md:divide-x md:divide-y-0">
          <CountUp value={50} suffix="+" label="Voitures en stock" />
          <CountUp value={5} suffix=" ans" label="d'experience" />
          <CountUp value={500} suffix="+" label="Clients satisfaits" />
        </div>
      </section>
    </>
  );
}
