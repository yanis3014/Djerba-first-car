import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { SiteSettingsForm, type SiteSettingsFormInitial } from "@/components/admin/SiteSettingsForm";
import { createSupabaseServerClient } from "@/lib/supabase";
import { SITE_SETTINGS_DEFAULTS } from "@/lib/site-settings-utils";

function rowToInitial(row: Record<string, unknown> | null): SiteSettingsFormInitial {
  const s = (k: string, def = "") => (typeof row?.[k] === "string" ? (row[k] as string) : def);
  return {
    phone_display: s("phone_display"),
    whatsapp_number: s("whatsapp_number"),
    contact_email: s("contact_email"),
    address: s("address") || "VV4Q+GH2, Houmt Souk, Tunisie",
    hours_weekday: s("hours_weekday") || SITE_SETTINGS_DEFAULTS.hours_weekday,
    hours_sunday: s("hours_sunday") || SITE_SETTINGS_DEFAULTS.hours_sunday,
    hero_title: s("hero_title") || SITE_SETTINGS_DEFAULTS.hero_title,
    hero_subtitle: s("hero_subtitle") || SITE_SETTINGS_DEFAULTS.hero_subtitle,
    hero_body: s("hero_body") || SITE_SETTINGS_DEFAULTS.hero_body,
    instagram_url: s("instagram_url"),
    instagram_label: s("instagram_label") || "@djerbafirstcar",
    facebook_url: s("facebook_url"),
    facebook_label: s("facebook_label") || "Djerba First Car",
    tiktok_url: s("tiktok_url"),
    tiktok_label: s("tiktok_label") || SITE_SETTINGS_DEFAULTS.tiktok_label,
  };
}

function formatLastModified(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} à ${h}h${m}`;
}

export default async function AdminSettingsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const row = (data as Record<string, unknown> | null) ?? null;
  const initial = rowToInitial(row);
  const updatedAt =
    typeof row?.updated_at === "string" ? row.updated_at : new Date().toISOString();
  const lastModifiedLabel = formatLastModified(updatedAt);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">
            Paramètres du site
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--color-muted)]">
            Coordonnées, horaires, texte du hero et réseaux sociaux pour Djerba First Car.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-bg-alt)]"
        >
          Voir le site →
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <SiteSettingsForm key={updatedAt} initial={initial} />

        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
              <HelpCircle className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
              <h2 className="font-[var(--font-display)] text-lg font-semibold text-neutral-900">
                Aide rapide
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
              <li>
                <span className="font-medium text-neutral-800">📞 Contact</span> — Ces informations
                apparaissent dans la navbar, le footer et la page contact.
              </li>
              <li>
                <span className="font-medium text-neutral-800">🕐 Horaires</span> — Affichés sur la
                homepage et la page contact.
              </li>
              <li>
                <span className="font-medium text-neutral-800">📱 Réseaux sociaux</span> — Liens dans
                le footer du site.
              </li>
              <li>
                <span className="font-medium text-neutral-800">🎬 Hero</span> — Texte affiché sur la
                vidéo de la homepage.
              </li>
            </ul>
            <div className="my-5 h-px bg-neutral-200" />
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Dernière modification
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-900">{lastModifiedLabel}</p>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex w-full items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              Prévisualiser le site
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
