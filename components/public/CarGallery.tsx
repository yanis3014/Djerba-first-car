"use client";

import { useEffect, useState } from "react";

interface CarGalleryProps {
  images: string[];
  alt: string;
}

export default function CarGallery({ images, alt }: CarGalleryProps) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length ? images : [""];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((prev) => (prev + 1) % safeImages.length);
      if (event.key === "ArrowLeft") setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [safeImages.length]);

  return (
    <div className="space-y-3">
      <div className="h-[360px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {safeImages[index] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={safeImages[index]} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">Pas d&apos;image</div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {safeImages.map((image, i) => (
          <button
            key={`${image}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-20 overflow-hidden rounded-md border ${
              index === i ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
            }`}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={`${alt}-${i + 1}`} className="h-full w-full object-cover" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
