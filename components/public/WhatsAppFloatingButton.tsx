"use client";

import { MessageCircle } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";
import { getWhatsAppHref } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 280, 320], [0, 0, 1]);
  const [hovered, setHovered] = useState(false);
  const [scrollPastHero, setScrollPastHero] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrollPastHero(y > 300);
  });

  const openWhatsApp = () => {
    const href = getWhatsAppHref();
    if (href === "#whatsapp") return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-center ${scrollPastHero ? "" : "pointer-events-none"}`}
      style={{ opacity }}
    >
      <div
        className={`pointer-events-none mb-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#0D0D0D] shadow-md transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        Contactez-nous
      </div>
      <div className="relative h-14 w-14">
        <span
          className="wa-pulse-ring absolute inset-0 rounded-full bg-[#CC1414]"
          aria-hidden
        />
        <motion.button
          type="button"
          onClick={openWhatsApp}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label="Contacter sur WhatsApp"
          className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#CC1414] text-white shadow-lg transition hover:bg-[#a80f0f]"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}
