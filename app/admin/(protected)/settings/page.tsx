import { SiteSettingsForm, type SiteSettingsFormInitial } from "@/components/admin/SiteSettingsForm";
import { createSupabaseServerClient } from "@/lib/supabase";

function rowToInitial(row: Record<string, unknown> | null): SiteSettingsFormInitial {
  const s = (k: string) => (typeof row?.[k] === "string" ? row[k] : "") as string;
  return {
    phone_display: s("phone_display"),
    whatsapp_number: s("whatsapp_number"),
    contact_email: s("contact_email"),
    address: s("address") || "Djerba, Houmt Essouk, Route Midoun Km2",
    instagram_url: s("instagram_url"),
    instagram_label: s("instagram_label") || "@djerbafirstcar",
    facebook_url: s("facebook_url"),
    facebook_label: s("facebook_label") || "Djerba First Car",
  };
}

export default async function AdminSettingsPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const initial = rowToInitial((data as Record<string, unknown> | null) ?? null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Paramètres du site</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Coordonnées et liens affichés sur le site public (footer, navigation, WhatsApp, page contact).
        </p>
      </div>
      <SiteSettingsForm initial={initial} />
    </div>
  );
}
