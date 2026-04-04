"use client";

import { useState, useTransition } from "react";
import type { LeadFormState } from "@/lib/actions/lead";
import { submitLeadForCar } from "@/lib/actions/lead";
import { HoneypotField } from "@/components/public/HoneypotField";
import { useSiteSettings } from "@/components/public/SiteSettingsProvider";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import type { Car } from "@/lib/types";

export function CarLeadForm({
  car,
  hideHeading = false,
  whatsappButtonClassName,
}: {
  car: Car;
  hideHeading?: boolean;
  whatsappButtonClassName?: string;
}) {
  const site = useSiteSettings();
  const [state, setState] = useState<LeadFormState | null>(null);
  const [pending, startTransition] = useTransition();
  const defaultMsg = `Bonjour, je suis intéressé par la ${car.brand} ${car.model}.`;
  const wa = buildWhatsAppHref(site.whatsapp_number, defaultMsg);

  return (
    <div>
      {hideHeading ? null : (
        <h2 className="font-[var(--font-body)] text-lg font-semibold text-[var(--color-text)]">Je suis intéressé</h2>
      )}
      <form
        className={cn("relative space-y-3", hideHeading ? "" : "mt-3")}
        action={(formData) => {
          startTransition(async () => {
            const result = await submitLeadForCar(undefined, formData);
            setState(result);
          });
        }}
      >
        <input type="hidden" name="car_id" value={car.id} />
        <HoneypotField />
        {state?.ok ? (
          <p className="rounded-[var(--radius-md)] border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-3 py-2 text-sm">
            Demande enregistrée. Nous vous contactons bientôt.
          </p>
        ) : null}
        {state && !state.ok ? (
          <p className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-red-50 px-3 py-2 text-sm text-[var(--color-error)]">
            {state.error}
          </p>
        ) : null}
        <Input name="name" required placeholder="Nom complet" disabled={pending} />
        <Input name="phone" type="tel" required placeholder="Téléphone" autoComplete="tel" disabled={pending} />
        <Input name="email" type="email" placeholder="Email (optionnel)" disabled={pending} />
        <Textarea name="message" rows={4} defaultValue={defaultMsg} disabled={pending} />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Envoi…" : "Envoyer la demande"}
        </Button>
      </form>
      <a
        href={wa}
        className={cn(
          "font-[var(--font-body)] mt-3 block w-full rounded-md bg-[#0D0D0D] px-4 py-3 text-center text-[14px] font-semibold text-white transition-colors hover:bg-[#1a1a1a]",
          whatsappButtonClassName,
        )}
        target="_blank"
        rel="noreferrer"
      >
        Contacter via WhatsApp
      </a>
    </div>
  );
}
