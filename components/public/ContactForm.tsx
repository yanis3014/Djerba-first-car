"use client";

import { useState, useTransition } from "react";
import type { ContactFormState } from "@/lib/actions/contact";
import { submitContactMessage } from "@/lib/actions/contact";
import { HoneypotField } from "@/components/public/HoneypotField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

export function ContactForm() {
  const [state, setState] = useState<ContactFormState | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="relative space-y-3"
      action={(formData) => {
        startTransition(async () => {
          const result = await submitContactMessage(undefined, formData);
          setState(result);
        });
      }}
    >
      {state?.ok ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-text)]">
          Message envoyé. Nous vous répondrons rapidement.
        </p>
      ) : null}
      {state && !state.ok ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">
          {state.error}
        </p>
      ) : null}

      <HoneypotField />

      <Input name="name" required placeholder="Nom complet" autoComplete="name" disabled={pending} />
      <Input name="phone" type="tel" placeholder="Téléphone" autoComplete="tel" disabled={pending} />
      <Input name="email" type="email" placeholder="Email" autoComplete="email" disabled={pending} />
      <Input name="subject" placeholder="Sujet" disabled={pending} />
      <div className="space-y-1.5">
        <label htmlFor="contact-request-type" className="text-sm font-medium text-[var(--color-text)]">
          Type de demande
        </label>
        <select
          id="contact-request-type"
          name="type"
          disabled={pending}
          defaultValue="info"
          className={cn(
            "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors duration-150 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <option value="info">Renseignement général</option>
          <option value="sell">Je veux vendre ma voiture</option>
          <option value="exchange">Je veux faire un échange</option>
          <option value="visit">Prendre rendez-vous</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <Textarea name="message" required rows={5} placeholder="Votre message" disabled={pending} />
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
