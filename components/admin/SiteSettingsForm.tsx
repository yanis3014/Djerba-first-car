"use client";

import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clapperboard, Clock, Loader2, Music2, Phone, Share2 } from "lucide-react";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
import { updateSiteSettings, type UpdateSiteSettingsState } from "@/app/actions/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsAppWebUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

export type SiteSettingsFormInitial = {
  phone_display: string;
  whatsapp_number: string;
  contact_email: string;
  address: string;
  hours_weekday: string;
  hours_sunday: string;
  hero_title: string;
  hero_subtitle: string;
  hero_body: string;
  instagram_url: string;
  instagram_label: string;
  facebook_url: string;
  facebook_label: string;
  tiktok_url: string;
  tiktok_label: string;
};

const initialActionState: UpdateSiteSettingsState | undefined = undefined;

function SectionCard({
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  iconClassName: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="font-[var(--font-display)] text-lg font-semibold text-neutral-900">{title}</h2>
          <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SubmitButton({
  hasChanges,
  showSaved,
}: {
  hasChanges: boolean;
  showSaved: boolean;
}) {
  const { pending } = useFormStatus();
  const disabled = !hasChanges || pending || showSaved;

  return (
    <Button
      type="submit"
      disabled={disabled}
      variant={hasChanges && !showSaved ? "primary" : "secondary"}
      className={cn(
        "min-w-[200px] font-semibold",
        hasChanges && !pending && !showSaved && "bg-red-600 hover:bg-red-500",
        showSaved && "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600",
      )}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Enregistrement…
        </span>
      ) : showSaved ? (
        "✓ Enregistré"
      ) : (
        "Enregistrer les paramètres"
      )}
    </Button>
  );
}

export function SiteSettingsForm({ initial }: { initial: SiteSettingsFormInitial }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateSiteSettings, initialActionState);
  const [values, setValues] = useState<SiteSettingsFormInitial>(initial);
  const [isDirty, setIsDirty] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setValues(initial);
    setIsDirty(false);
  }, [initial]);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Paramètres enregistrés");
      setIsDirty(false);
      router.refresh();
      setShowSaved(true);
      const t = window.setTimeout(() => setShowSaved(false), 3000);
      return () => window.clearTimeout(t);
    }
  }, [state, router]);

  const waPreview = useMemo(() => whatsAppWebUrl(values.whatsapp_number), [values.whatsapp_number]);

  function patch<K extends keyof SiteSettingsFormInitial>(key: K, v: SiteSettingsFormInitial[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setIsDirty(true);
  }

  return (
    <div className="min-w-0 space-y-6">
      {isDirty ? (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-amber-900">⚠️ Modifications non enregistrées</p>
          <button
            type="submit"
            form="site-settings-form"
            className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-500"
          >
            Enregistrer maintenant
          </button>
        </div>
      ) : null}

      <form id="site-settings-form" action={formAction} className="space-y-6">
        {state && !state.ok ? (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}

        {/* Contact */}
        <SectionCard
          icon={Phone}
          iconClassName="bg-red-600"
          title="Contact"
          subtitle="Coordonnées visibles sur tout le site"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="phone_display" className="text-sm font-medium text-neutral-800">
                Téléphone affiché
              </label>
              <Input
                id="phone_display"
                name="phone_display"
                value={values.phone_display}
                onChange={(e) => patch("phone_display", e.target.value)}
                placeholder="+216 XX XXX XXX"
                className="mt-1.5 bg-neutral-50"
              />
              <p className="mt-1 text-xs text-neutral-500">Affiché dans la navbar et le footer</p>
            </div>
            <div>
              <label htmlFor="whatsapp_number" className="text-sm font-medium text-neutral-800">
                Numéro WhatsApp
              </label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                value={values.whatsapp_number}
                onChange={(e) => patch("whatsapp_number", e.target.value)}
                placeholder="+21600000000"
                className="mt-1.5 bg-neutral-50"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Format international sans espaces ni tirets
              </p>
              <p className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700">
                Lien généré : {waPreview}
              </p>
            </div>
            <div>
              <label htmlFor="contact_email" className="text-sm font-medium text-neutral-800">
                Email de contact
              </label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={values.contact_email}
                onChange={(e) => patch("contact_email", e.target.value)}
                placeholder="contact@exemple.com"
                className="mt-1.5 bg-neutral-50"
              />
              <p className="mt-1 text-xs text-neutral-500">Affiché sur la page contact</p>
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium text-neutral-800">
                Adresse complète
              </label>
              <Textarea
                id="address"
                name="address"
                rows={2}
                value={values.address}
                onChange={(e) => patch("address", e.target.value)}
                className="mt-1.5 bg-neutral-50"
              />
              <p className="mt-1 text-xs text-neutral-500">Utilisée pour Google Maps et le footer</p>
            </div>
          </div>
        </SectionCard>

        {/* Horaires */}
        <SectionCard
          icon={Clock}
          iconClassName="bg-sky-600"
          title="Horaires"
          subtitle="Affichage sur l’accueil et la page contact"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hours_weekday" className="text-sm font-medium text-neutral-800">
                Lundi – Samedi
              </label>
              <Input
                id="hours_weekday"
                name="hours_weekday"
                value={values.hours_weekday}
                onChange={(e) => patch("hours_weekday", e.target.value)}
                placeholder="9h00–18h30"
                className="mt-1.5 bg-neutral-50"
              />
            </div>
            <div>
              <label htmlFor="hours_sunday" className="text-sm font-medium text-neutral-800">
                Dimanche
              </label>
              <Input
                id="hours_sunday"
                name="hours_sunday"
                value={values.hours_sunday}
                onChange={(e) => patch("hours_sunday", e.target.value)}
                placeholder="Fermé"
                className="mt-1.5 bg-neutral-50"
              />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-neutral-200 bg-[#F8F7F5] px-4 py-3">
            <p className="text-center text-sm text-neutral-700">
              <span className="font-medium">Lun–Sam :</span> {values.hours_weekday}
              <span className="mx-2 text-neutral-400">•</span>
              <span className="font-medium">Dim :</span> {values.hours_sunday}
            </p>
          </div>
        </SectionCard>

        {/* Hero */}
        <SectionCard
          icon={Clapperboard}
          iconClassName="bg-violet-600"
          title="Hero homepage"
          subtitle="Texte sur la vidéo d’accueil"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="hero_title" className="text-sm font-medium text-neutral-800">
                  Titre principal
                </label>
                <span className="text-xs text-neutral-500">
                  {values.hero_title.length} / 40 caractères
                </span>
              </div>
              <Input
                id="hero_title"
                name="hero_title"
                value={values.hero_title}
                onChange={(e) => patch("hero_title", e.target.value.slice(0, 40))}
                maxLength={40}
                className="mt-1.5 bg-neutral-50"
              />
            </div>
            <div>
              <label htmlFor="hero_subtitle" className="text-sm font-medium text-neutral-800">
                Sous-titre en rouge
              </label>
              <Input
                id="hero_subtitle"
                name="hero_subtitle"
                value={values.hero_subtitle}
                onChange={(e) => patch("hero_subtitle", e.target.value.slice(0, 80))}
                maxLength={80}
                className="mt-1.5 bg-neutral-50"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="hero_body" className="text-sm font-medium text-neutral-800">
                  Description
                </label>
                <span className="text-xs text-neutral-500">
                  {values.hero_body.length} / 150 caractères
                </span>
              </div>
              <Textarea
                id="hero_body"
                name="hero_body"
                rows={3}
                value={values.hero_body}
                onChange={(e) => patch("hero_body", e.target.value.slice(0, 150))}
                maxLength={150}
                className="mt-1.5 bg-neutral-50"
              />
            </div>
            <div className="rounded-xl bg-[#111] px-5 py-6 text-white">
              <p className="text-[11px] uppercase tracking-widest text-white/70">Djerba • Tunisie</p>
              <h3
                className="font-[var(--font-display)] mt-3 font-semibold tracking-[0.08em]"
                style={{ fontSize: "clamp(18px, 3vw, 28px)", lineHeight: 1.1 }}
              >
                {values.hero_title || "…"}
              </h3>
              <p
                className="font-[var(--font-display)] mt-2 font-semibold tracking-[0.08em] text-[#CC1414]"
                style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
              >
                {values.hero_subtitle || "…"}
              </p>
              <p className="font-[var(--font-body)] mt-4 max-w-md text-sm leading-relaxed text-white/80">
                {values.hero_body || "…"}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Réseaux */}
        <SectionCard
          icon={Share2}
          iconClassName="bg-emerald-600"
          title="Réseaux sociaux"
          subtitle="Liens affichés dans le footer"
        >
          <div className="space-y-3">
            <div className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex w-full shrink-0 items-center gap-2 sm:w-36">
                <IconInstagram className="h-5 w-5 text-pink-600" aria-hidden />
                <span className="text-sm font-medium text-neutral-800">Instagram</span>
              </div>
              <Input
                name="instagram_url"
                type="url"
                value={values.instagram_url}
                onChange={(e) => patch("instagram_url", e.target.value)}
                placeholder="https://instagram.com/…"
                className="min-w-0 flex-1 bg-white text-sm"
              />
              <Input
                name="instagram_label"
                value={values.instagram_label}
                onChange={(e) => patch("instagram_label", e.target.value)}
                placeholder="@compte"
                className="w-full shrink-0 bg-white text-sm sm:max-w-[200px]"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex w-full shrink-0 items-center gap-2 sm:w-36">
                <IconFacebook className="h-5 w-5 text-blue-600" aria-hidden />
                <span className="text-sm font-medium text-neutral-800">Facebook</span>
              </div>
              <Input
                name="facebook_url"
                type="url"
                value={values.facebook_url}
                onChange={(e) => patch("facebook_url", e.target.value)}
                placeholder="https://facebook.com/…"
                className="min-w-0 flex-1 bg-white text-sm"
              />
              <Input
                name="facebook_label"
                value={values.facebook_label}
                onChange={(e) => patch("facebook_label", e.target.value)}
                placeholder="Nom de la page"
                className="w-full shrink-0 bg-white text-sm sm:max-w-[200px]"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex w-full shrink-0 items-center gap-2 sm:w-36">
                <Music2 className="h-5 w-5 text-neutral-800" aria-hidden />
                <span className="text-sm font-medium text-neutral-800">TikTok</span>
              </div>
              <Input
                name="tiktok_url"
                type="url"
                value={values.tiktok_url}
                onChange={(e) => patch("tiktok_url", e.target.value)}
                placeholder="https://www.tiktok.com/@…"
                className="min-w-0 flex-1 bg-white text-sm"
              />
              <Input
                name="tiktok_label"
                value={values.tiktok_label}
                onChange={(e) => patch("tiktok_label", e.target.value)}
                placeholder="@djerbafirstcar"
                className="w-full shrink-0 bg-white text-sm sm:max-w-[200px]"
              />
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <SubmitButton hasChanges={isDirty} showSaved={showSaved} />
        </div>
      </form>
    </div>
  );
}
