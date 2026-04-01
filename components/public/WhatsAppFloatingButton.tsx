"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export default function WhatsAppFloatingButton() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > 200);
  });

  const openWhatsApp = () => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    const clean = number.replace(/\D/g, "");
    window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      aria-label="Contacter sur WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-all duration-300 hover:bg-[var(--color-accent-hover)] ${
        visible ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
      }`}
    >
      <span className="absolute h-14 w-14 rounded-full border-2 border-[var(--color-accent)] fab-ring" />
      <MessageCircle className="relative z-10 h-6 w-6" />
    </button>
  );
}
