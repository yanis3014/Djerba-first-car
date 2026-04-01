import { getPublicPhoneDisplay } from "@/lib/site";

export default function Footer() {
  const phone = getPublicPhoneDisplay();

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
          <p>Djerba, Houmt Essouk, Route Midoun Km2</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-white">Contact</p>
          <p>Tel: {phone}</p>
          <p>Instagram: @djerbafirstcar</p>
          <p>Facebook: Djerba First Car</p>
        </div>
      </div>
    </footer>
  );
}
