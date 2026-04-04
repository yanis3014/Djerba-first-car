"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { updateSiteSettings, type UpdateSiteSettingsState } from "@/app/actions/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type SiteSettingsFormInitial = {
  phone_display: string;
  whatsapp_number: string;
  contact_email: string;
  address: string;
  instagram_url: string;
  instagram_label: string;
  facebook_url: string;
  facebook_label: string;
};

const initialActionState: UpdateSiteSettingsState | undefined = undefined;

export function SiteSettingsForm({ initial }: { initial: SiteSettingsFormInitial }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateSiteSettings, initialActionState);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Contact</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Téléphone affiché et WhatsApp : laisser vide pour reprendre les valeurs{" "}
          <code className="rounded bg-[var(--color-bg-alt)] px-1 text-xs">NEXT_PUBLIC_PHONE_DISPLAY</code> et{" "}
          <code className="rounded bg-[var(--color-bg-alt)] px-1 text-xs">NEXT_PUBLIC_WHATSAPP_NUMBER</code> si
          définies.
        </p>

        <div className="space-y-2">
          <label htmlFor="phone_display" className="text-sm font-medium text-[var(--color-text)]">
            Téléphone (affichage)
          </label>
          <Input
            id="phone_display"
            name="phone_display"
            defaultValue={initial.phone_display}
            placeholder="+216 XX XXX XXX"
            className="bg-[var(--color-bg)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="whatsapp_number" className="text-sm font-medium text-[var(--color-text)]">
            Numéro WhatsApp (indicatif inclus)
          </label>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            defaultValue={initial.whatsapp_number}
            placeholder="+216…"
            className="bg-[var(--color-bg)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact_email" className="text-sm font-medium text-[var(--color-text)]">
            Email de contact
          </label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={initial.contact_email}
            placeholder="contact@exemple.com"
            className="bg-[var(--color-bg)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-[var(--color-text)]">
            Adresse
          </label>
          <Textarea
            id="address"
            name="address"
            required
            rows={3}
            defaultValue={initial.address}
            className="bg-[var(--color-bg)]"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Réseaux sociaux</h2>

        <div className="space-y-2">
          <label htmlFor="instagram_url" className="text-sm font-medium text-[var(--color-text)]">
            Lien Instagram
          </label>
          <Input
            id="instagram_url"
            name="instagram_url"
            type="url"
            defaultValue={initial.instagram_url}
            placeholder="https://instagram.com/…"
            className="bg-[var(--color-bg)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="instagram_label" className="text-sm font-medium text-[var(--color-text)]">
            Texte affiché (Instagram)
          </label>
          <Input
            id="instagram_label"
            name="instagram_label"
            defaultValue={initial.instagram_label}
            placeholder="@votrecompte"
            className="bg-[var(--color-bg)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="facebook_url" className="text-sm font-medium text-[var(--color-text)]">
            Lien Facebook
          </label>
          <Input
            id="facebook_url"
            name="facebook_url"
            type="url"
            defaultValue={initial.facebook_url}
            placeholder="https://facebook.com/…"
            className="bg-[var(--color-bg)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="facebook_label" className="text-sm font-medium text-[var(--color-text)]">
            Texte affiché (Facebook)
          </label>
          <Input
            id="facebook_label"
            name="facebook_label"
            defaultValue={initial.facebook_label}
            placeholder="Nom de la page"
            className="bg-[var(--color-bg)]"
          />
        </div>
      </div>

      {state?.ok ? (
        <p className="text-sm text-[var(--color-success)]">Paramètres enregistrés.</p>
      ) : null}
      {state && !state.ok ? (
        <p className="text-sm text-[var(--color-error)]">{state.error}</p>
      ) : null}

      <Button type="submit" className="min-w-[160px]">
        Enregistrer
      </Button>
    </form>
  );
}
