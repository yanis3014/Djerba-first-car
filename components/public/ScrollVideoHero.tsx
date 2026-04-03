"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 135;
const FRAMES_PATH = "/frames/frame_";

export default function ScrollVideoHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [scrollYProgress, drawFrame]);

  useEffect(() => {
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
  }, [drawFrame]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        {!framesLoaded && (
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
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
          }}
          aria-hidden
        />

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="mx-auto w-full max-w-6xl text-left">
            <p className="text-[11px] uppercase tracking-widest text-white">
              DJERBA • TUNISIE
            </p>
            <motion.div
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="my-5 h-[48px] w-[4px] bg-[#CC1414]"
            />
            <h1
              className="font-[var(--font-display)] font-semibold tracking-[0.08em] text-white"
              style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 1.05 }}
            >
              Roulez mieux, payez juste.
            </h1>
            <p
              className="mt-2 font-[var(--font-display)] font-semibold tracking-[0.08em] text-[#CC1414]"
              style={{ fontSize: "clamp(28px, 5vw, 56px)" }}
            >
              COMMENCE ICI
            </p>
            <p className="font-[var(--font-body)] mt-6 max-w-[500px] text-base text-white/80 md:text-lg">
              Chaque véhicule est une promesse. Celle de vous accompagner sur les
              routes de Djerba avec style, confiance et sérénité.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
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
            </div>
          </div>
        </motion.div>

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
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-white" aria-hidden />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
