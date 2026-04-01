export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "vehicule";
}

/** Slug URL saisi par l’admin (espaces / underscores → tirets, puis slugify). */
export function normalizeSlugInput(input: string): string {
  return slugify(input.replace(/[\s_]+/g, "-"));
}
