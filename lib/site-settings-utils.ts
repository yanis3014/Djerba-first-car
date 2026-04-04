/** Adresse de secours si la base est vide ou indisponible. */
export const SITE_SETTINGS_FALLBACK_ADDRESS = "Djerba, Houmt Essouk, Route Midoun Km2";

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
