import type { Metadata } from "next";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import { ContactForm } from "@/components/public/ContactForm";
import { Card, CardTitle } from "@/components/ui/card";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { getPublicPhoneDisplay, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${SITE_NAME} — Djerba. Formulaire, téléphone et WhatsApp.`,
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description: "Écrivez-nous ou contactez-nous par WhatsApp.",
  },
};

export default function ContactPage() {
  const phone = getPublicPhoneDisplay();
  const whatsapp = getWhatsAppHref();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-accent)]">Contact</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Formulaire, téléphone et prise de rendez-vous.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-accent)]">Écrire un message</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Un message suffit : nous vous répondons rapidement.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Card>

        <section className="space-y-4">
          <Card>
            <CardTitle>Informations</CardTitle>
            <p className="mt-3 text-[var(--color-muted)]">Djerba Houmt Essouk, Route Midoun Km2</p>
            <p className="text-[var(--color-muted)]">
              Téléphone :{" "}
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-[var(--color-accent)] hover:underline">
                {phone}
              </a>
            </p>
            <p className="text-[var(--color-muted)]">
              WhatsApp :{" "}
              <a href={whatsapp} className="text-[var(--color-accent)] hover:underline" target="_blank" rel="noreferrer">
                Écrire sur WhatsApp
              </a>
            </p>
          </Card>
          <Card>
            <CardTitle>Horaires</CardTitle>
            <p className="mt-3 text-[var(--color-muted)]">Lun - Sam : 08:30 - 18:30</p>
            <p className="text-[var(--color-muted)]">Dimanche : fermeture partielle</p>
          </Card>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <iframe
              title="Djerba First Car - localisation"
              src="https://maps.google.com/maps?q=Djerba%20Houmt%20Souk&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
