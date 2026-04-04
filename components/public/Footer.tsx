import Link from "next/link";

import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer() {
  const s = await getSiteSettings();

  return (
    <footer className="mt-auto border-t border-[var(--color-border-dark)] bg-[var(--color-surface-dark)]">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-sm text-[#cfcfcf] md:grid-cols-3">
        <div>
          <p className="mb-2 font-semibold text-white">DJERBA FIRST CAR</p>
          <span className="mb-2 block h-[2px] w-6 bg-[var(--color-accent)]" />
          <p>Agence premium automobile</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Adresse</p>
          <p>{s.address}</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Contact</p>
          <p>Tel: {s.phone_display}</p>
          {s.contact_email ? (
            <p>
              Email:{" "}
              <a
                href={`mailto:${s.contact_email}`}
                className="text-[#cfcfcf] underline-offset-2 hover:underline"
              >
                {s.contact_email}
              </a>
            </p>
          ) : null}
          <p>
            Instagram:{" "}
            {s.instagram_url ? (
              <a
                href={s.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#cfcfcf] underline-offset-2 hover:underline"
              >
                {s.instagram_label}
              </a>
            ) : (
              s.instagram_label
            )}
          </p>
          <p>
            Facebook:{" "}
            {s.facebook_url ? (
              <a
                href={s.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#cfcfcf] underline-offset-2 hover:underline"
              >
                {s.facebook_label}
              </a>
            ) : (
              s.facebook_label
            )}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-[var(--color-border-dark)] px-4 pb-8 pt-4">
        <p className="text-center text-sm text-[#cfcfcf]">
          © {new Date().getFullYear()} Djerba First Car — Tous droits réservés
          <Link
            href="/admin/login"
            prefetch={false}
            className="cursor-default text-inherit no-underline hover:text-current"
          >
            .
          </Link>
        </p>
      </div>
    </footer>
  );
}
