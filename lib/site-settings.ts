import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/site-settings-types";
import { SITE_SETTINGS_DEFAULTS, SITE_SETTINGS_FALLBACK_ADDRESS } from "@/lib/site-settings-utils";

export type { SiteSettings } from "@/lib/site-settings-types";

function envPhoneDisplay(): string {
  return process.env.NEXT_PUBLIC_PHONE_DISPLAY?.trim() || "+216 53 145 000";
}

function envWhatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "";
}

function mergeRow(row: Record<string, unknown> | null): SiteSettings {
  const phone_display =
    typeof row?.phone_display === "string" && row.phone_display.trim()
      ? row.phone_display.trim()
      : envPhoneDisplay();

  const whatsapp_number =
    typeof row?.whatsapp_number === "string" && row.whatsapp_number.trim()
      ? row.whatsapp_number.trim()
      : envWhatsappNumber();

  const address =
    typeof row?.address === "string" && row.address.trim()
      ? row.address.trim()
      : SITE_SETTINGS_FALLBACK_ADDRESS;

  const contact_email =
    typeof row?.contact_email === "string" ? row.contact_email.trim() : "";

  const instagram_url = typeof row?.instagram_url === "string" ? row.instagram_url.trim() : "";
  const instagram_label =
    typeof row?.instagram_label === "string" && row.instagram_label.trim()
      ? row.instagram_label.trim()
      : "@djerbafirstcar";

  const facebook_url = typeof row?.facebook_url === "string" ? row.facebook_url.trim() : "";
  const facebook_label =
    typeof row?.facebook_label === "string" && row.facebook_label.trim()
      ? row.facebook_label.trim()
      : "Djerba First Car";

  const hours_weekday =
    typeof row?.hours_weekday === "string" && row.hours_weekday.trim()
      ? row.hours_weekday.trim()
      : SITE_SETTINGS_DEFAULTS.hours_weekday;

  const hours_sunday =
    typeof row?.hours_sunday === "string" && row.hours_sunday.trim()
      ? row.hours_sunday.trim()
      : SITE_SETTINGS_DEFAULTS.hours_sunday;

  const hero_title =
    typeof row?.hero_title === "string" && row.hero_title.trim()
      ? row.hero_title.trim()
      : SITE_SETTINGS_DEFAULTS.hero_title;

  const hero_subtitle =
    typeof row?.hero_subtitle === "string" && row.hero_subtitle.trim()
      ? row.hero_subtitle.trim()
      : SITE_SETTINGS_DEFAULTS.hero_subtitle;

  const hero_body =
    typeof row?.hero_body === "string" && row.hero_body.trim()
      ? row.hero_body.trim()
      : SITE_SETTINGS_DEFAULTS.hero_body;

  const tiktok_url = typeof row?.tiktok_url === "string" ? row.tiktok_url.trim() : "";
  const tiktok_label =
    typeof row?.tiktok_label === "string" && row.tiktok_label.trim()
      ? row.tiktok_label.trim()
      : SITE_SETTINGS_DEFAULTS.tiktok_label;

  const updated_at =
    typeof row?.updated_at === "string" ? row.updated_at : new Date().toISOString();

  return {
    id: 1,
    phone_display,
    whatsapp_number,
    contact_email,
    address,
    hours_weekday,
    hours_sunday,
    hero_title,
    hero_subtitle,
    hero_body,
    instagram_url,
    instagram_label,
    facebook_url,
    facebook_label,
    tiktok_url,
    tiktok_label,
    updated_at,
  };
}

async function fetchSiteSettingsRow(): Promise<Record<string, unknown> | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Lecture des paramètres site (ligne singleton), avec repli sur les variables d’environnement. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const row = await fetchSiteSettingsRow();
  return mergeRow(row);
});
