import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-10 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-accent)]">Contact</h1>
          <form className="mt-6 space-y-3">
            <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Nom complet" />
            <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Telephone" />
            <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Email" />
            <input className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" placeholder="Sujet" />
            <textarea className="w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm" rows={5} placeholder="Message" />
            <button type="button" className="rounded-md bg-[var(--color-accent)] px-4 py-2 font-medium text-white hover:bg-[var(--color-accent-hover)]">
              Envoyer
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-xl text-[var(--color-accent)]">Informations</h2>
            <p className="mt-3 text-[var(--color-muted)]">Djerba Houmt Essouk, Route Midoun Km2</p>
            <p className="text-[var(--color-muted)]">Telephone: +216 XX XXX XXX</p>
            <p className="text-[var(--color-muted)]">WhatsApp: +216 XX XXX XXX</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-xl text-[var(--color-accent)]">Horaires</h2>
            <p className="mt-3 text-[var(--color-muted)]">Lun - Sam: 08:30 - 18:30</p>
            <p className="text-[var(--color-muted)]">Dimanche: Fermeture partielle</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
            <iframe
              title="Djerba First Car - localisation"
              src="https://maps.google.com/maps?q=Djerba%20Houmt%20Souk&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
