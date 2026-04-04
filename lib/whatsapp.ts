import { SITE_NAME } from "@/lib/site";

const WHATSAPP_PLACEHOLDER = "#whatsapp";

/** Message prérempli pour les liens WhatsApp généraux (navbar, contact, bulle, accueil). */
export const DEFAULT_WHATSAPP_PREFILL = `Bonjour, je souhaite des informations sur ${SITE_NAME}.`;

function digitsForWaMe(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  return digits;
}

/** Construit un lien `wa.me` à partir d’un numéro brut (indicatif inclus). */
export function buildWhatsAppHref(rawNumber: string, prefillMessage?: string): string {
  const raw = rawNumber.trim();
  if (!raw) {
    return WHATSAPP_PLACEHOLDER;
  }
  const digits = digitsForWaMe(raw);
  if (!digits) {
    return WHATSAPP_PLACEHOLDER;
  }
  const base = `https://wa.me/${digits}`;
  if (prefillMessage?.trim()) {
    return `${base}?text=${encodeURIComponent(prefillMessage.trim())}`;
  }
  return base;
}

/** Lien WhatsApp à partir de la variable d’environnement uniquement. */
export function getWhatsAppHref(prefillMessage?: string): string {
  return buildWhatsAppHref(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "", prefillMessage);
}

/** Lien WhatsApp Web (`wa.me`) à partir d’un numéro saisi (chiffres conservés, préfixe 00 retiré). */
export function whatsAppWebUrl(phone: string): string {
  const digits = digitsForWaMe(phone);
  if (!digits) {
    return "https://wa.me/";
  }
  return `https://wa.me/${digits}`;
}
