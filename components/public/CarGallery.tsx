"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CarGalleryProps {
  images: string[];
  alt: string;
}

export default function CarGallery({ images, alt }: CarGalleryProps) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length ? images : [];

  const go = useCallback(
    (delta: number) => {
      if (safeImages.length === 0) return;
      setIndex((prev) => (prev + delta + safeImages.length) % safeImages.length);
    },
    [safeImages.length],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [go]);

  if (safeImages.length === 0) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E0DDD8] bg-[#F3F3F3]">
        <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-[#6B6B6B]">
          Pas d&apos;image
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E0DDD8] bg-[#F0EFEC]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={safeImages[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={safeImages[index]}
              alt={`${alt} — photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={2} />
            </button>
            <p className="absolute bottom-3 right-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
              {index + 1} / {safeImages.length}
            </p>
          </>
        ) : null}
      </div>

      {safeImages.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {safeImages.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                index === i ? "border-[#CC1414] ring-1 ring-[#CC1414]" : "border-[#E0DDD8] hover:border-[#B8B4AE]"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} miniature ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
