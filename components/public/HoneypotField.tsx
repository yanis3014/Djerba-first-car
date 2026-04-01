import { PUBLIC_FORM_HONEYPOT_NAME } from "@/lib/public-form-constants";

/** Champ invisible pour piéger les bots (doit rester vide). */
export function HoneypotField() {
  return (
    <div
      className="pointer-events-none absolute left-[-9999px] top-0 h-px w-px overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <label htmlFor={PUBLIC_FORM_HONEYPOT_NAME}>Ne pas remplir</label>
      <input
        type="text"
        id={PUBLIC_FORM_HONEYPOT_NAME}
        name={PUBLIC_FORM_HONEYPOT_NAME}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
