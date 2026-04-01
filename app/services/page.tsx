import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/public/ServicesPageContent";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Vente, achat et échange de véhicules premium à Djerba — ${SITE_NAME}.`,
  openGraph: {
    title: `Services | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
