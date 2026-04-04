/** Adresse de secours si la base est vide ou indisponible. */
export const SITE_SETTINGS_FALLBACK_ADDRESS = "VV4Q+GH2, Houmt Souk, Tunisie";

/** Valeurs par défaut si colonnes absentes ou vides (alignées sur la migration SQL). */
export const SITE_SETTINGS_DEFAULTS = {
  hours_weekday: "8h00 - 18h00",
  hours_sunday: "9h00 - 14h00",
  hero_title: "L'ÉMOTION DE CONDUIRE",
  hero_subtitle: "COMMENCE ICI",
  hero_body: "Chaque véhicule est une promesse.",
  tiktok_label: "@djerbafirstcar",
} as const;

export function mapsEmbedUrlFromAddress(address: string): string {
  const q = encodeURIComponent(address.trim() || SITE_SETTINGS_FALLBACK_ADDRESS);
  return `https://maps.google.com/maps?q=${q}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}

export function mapsDirectionsUrlFromAddress(address: string): string {
  const d = encodeURIComponent(address.trim() || SITE_SETTINGS_FALLBACK_ADDRESS);
  return `https://www.google.com/maps/dir/?api=1&destination=${d}`;
}

export function phoneDisplayToTelHref(phoneDisplay: string): string {
  const compact = phoneDisplay.replace(/\s/g, "");
  if (!compact) return "#";
  return `tel:${compact}`;
}
