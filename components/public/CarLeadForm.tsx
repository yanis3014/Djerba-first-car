"use client";

import { useState, useTransition } from "react";
import type { LeadFormState } from "@/lib/actions/lead";
import { submitLeadForCar } from "@/lib/actions/lead";
import { HoneypotField } from "@/components/public/HoneypotField";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Car } from "@/lib/types";

export function CarLeadForm({ car }: { car: Car }) {
  const [state, setState] = useState<LeadFormState | null>(null);
  const [pending, startTransition] = useTransition();
  const defaultMsg = `Bonjour, je suis intéressé par la ${car.brand} ${car.model}.`;
  const wa = getWhatsAppHref(defaultMsg);

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">Je suis intéressé</h2>
      <form
        className="relative mt-3 space-y-3"
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
        className="mt-3 block rounded-[var(--radius-md)] bg-[var(--color-surface-dark)] px-4 py-2.5 text-center text-sm text-white transition-colors hover:opacity-90"
        target="_blank"
        rel="noreferrer"
      >
        Contacter via WhatsApp
      </a>
    </div>
  );
}
