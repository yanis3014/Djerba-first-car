"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SITE_SETTINGS_DEFAULTS } from "@/lib/site-settings-utils";

const TOTAL_FRAMES = 135;
const FRAMES_PATH = "/frames/frame_";
const FIRST_FRAME_SRC = "/frames/frame_0001.jpg";

type ScrollVideoHeroProps = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBody?: string;
};

export default function ScrollVideoHero({
  heroTitle,
  heroSubtitle,
  heroBody,
}: ScrollVideoHeroProps = {}) {
  const title = heroTitle?.trim() || SITE_SETTINGS_DEFAULTS.hero_title;
  const subtitle = heroSubtitle?.trim() || SITE_SETTINGS_DEFAULTS.hero_subtitle;
  const body = heroBody?.trim() || SITE_SETTINGS_DEFAULTS.hero_body;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const mobileLayout = isMobile;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = framesRef.current[index];
    if (!canvas || !ctx || !img || !img.complete) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (mobileLayout) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const latest = scrollYProgress.get();
      const frameIndex = Math.min(
        Math.floor(latest * TOTAL_FRAMES),
        TOTAL_FRAMES - 1,
      );
      drawFrame(frameIndex);
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [scrollYProgress, drawFrame, mobileLayout]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    if (mobileLayout) return;

    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const num = String(i).padStart(4, "0");
      img.src = `${FRAMES_PATH}${num}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          setFramesLoaded(true);
          drawFrame(0);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, [drawFrame, mobileLayout]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (mobileLayout) return;
    const frameIndex = Math.min(
      Math.floor(latest * TOTAL_FRAMES),
      TOTAL_FRAMES - 1,
    );
    drawFrame(frameIndex);
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={mobileLayout ? "relative h-screen" : "relative h-[250vh]"}
    >
      <div
        className={
          mobileLayout
            ? "relative h-screen overflow-hidden"
            : "sticky top-0 h-[100vh] overflow-hidden"
        }
      >
        {!mobileLayout && !framesLoaded && (
          <div className="absolute inset-0 bg-[#111111]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-48 overflow-hidden rounded-full bg-[#222]">
                <div
                  className="h-full animate-pulse rounded-full bg-[#CC1414]"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>
        )}

        {mobileLayout ? (
          <div className="absolute inset-0">
            <Image
              src={FIRST_FRAME_SRC}
              alt="Djerba First Car"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
          }}
          aria-hidden
        />

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-6 lg:px-4"
          style={
            mobileLayout
              ? { opacity: 1, y: 0 }
              : { opacity: contentOpacity, y: contentY }
          }
        >
          <div className="mx-auto w-full max-w-6xl text-left">
            <p className="mt-16 text-[11px] uppercase tracking-widest text-white lg:mt-0">
              DJERBA • TUNISIE
            </p>
            <motion.div
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="my-5 hidden h-[48px] w-[4px] bg-[#CC1414] sm:block"
            />
            <h1
              className="font-[var(--font-display)] font-semibold tracking-[0.08em] text-white"
              style={{ fontSize: "clamp(32px, 7vw, 96px)", lineHeight: 1.05 }}
            >
              {title}
            </h1>
            <p
              className="mt-2 font-[var(--font-display)] font-semibold tracking-[0.08em] text-[#CC1414]"
              style={{ fontSize: "clamp(20px, 4vw, 56px)" }}
            >
              {subtitle}
            </p>
            <p className="font-[var(--font-body)] mt-6 max-w-[500px] text-base text-white/80 md:text-lg">
              {body}
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/voitures"
                className="rounded-md bg-[var(--color-accent)] px-6 py-3 text-center font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                Voir nos voitures
              </Link>
              <Link
                href="/contact"
                className="rounded-md bg-[var(--color-surface-dark)] px-6 py-3 text-center font-medium text-white transition hover:opacity-90"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </motion.div>

        {!mobileLayout && (
          <>
            <motion.div
              className="absolute bottom-0 left-0 z-10 h-[3px] bg-[#CC1414]"
              style={{ width: progressWidth }}
              aria-hidden
            />

            <motion.div
              className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
              style={{ opacity: hintOpacity }}
            >
              <p className="text-center text-xs text-white">Faites défiler</p>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="h-6 w-6 text-white" aria-hidden />
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
