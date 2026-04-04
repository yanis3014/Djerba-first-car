"use client";

import { Toaster } from "sonner";

/** Toasts admin : coin bas-droit, cohérent avec la charte (variables CSS). */
export function AdminToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={4500}
      gap={12}
      toastOptions={{
        className:
          "font-[var(--font-body),sans-serif] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]",
        descriptionClassName: "text-[var(--color-muted)]",
      }}
    />
  );
}
