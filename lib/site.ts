/** URL canonique du site (SEO, sitemap, Open Graph). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export const SITE_NAME = "Djerba First Car";

export const SITE_DESCRIPTION =
  "Agence premium de vente, achat et échange de voitures à Djerba — catalogue, essai et accompagnement.";

/** Affichage téléphone (variable publique pour le client). */
export function getPublicPhoneDisplay(): string {
  return process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+216 53 145 000";
}
