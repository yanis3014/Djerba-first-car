/**
 * Lien WhatsApp (numéro international sans + dans l’URL).
 * `NEXT_PUBLIC_WHATSAPP_NUMBER` peut contenir des espaces ou le préfixe +216.
 */
export function getWhatsAppHref(prefilledMessage?: string): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return "#whatsapp";
  }
  const base = `https://wa.me/${digits}`;
  if (prefilledMessage?.trim()) {
    return `${base}?text=${encodeURIComponent(prefilledMessage.trim())}`;
  }
  return base;
}
