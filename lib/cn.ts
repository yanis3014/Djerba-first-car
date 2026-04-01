/** Concatène des classes Tailwind en ignorant les valeurs falsy. */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
