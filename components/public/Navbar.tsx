"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WhatsAppFloatingButton from "@/components/public/WhatsAppFloatingButton";
import { useSiteSettings } from "@/components/public/SiteSettingsProvider";
import { buildWhatsAppHref } from "@/lib/whatsapp";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/voitures", label: "Voitures" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const site = useSiteSettings();
  const phoneDisplay = site.phone_display;
  const whatsappHref = buildWhatsAppHref(site.whatsapp_number);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        ref={containerRef}
        className={`fixed top-0 z-50 w-full border-b border-[#E0DDD8] bg-white transition-shadow duration-200 ${
          isScrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <nav className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center justify-between px-4 md:px-6">
          <Link href="/" className="inline-flex items-center font-[var(--font-body)] text-base tracking-wide">
            <span className="font-extrabold text-[#0D0D0D]">DJERBA</span>
            <span className="mx-2 text-[#CC1414]">—</span>
            <span className="font-bold text-[#CC1414]">FIRST CAR</span>
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-[14px] font-medium transition-colors duration-200 ${
                  isActive(item.href) ? "text-[#CC1414]" : "text-[#0D0D0D] hover:text-[#CC1414]"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-[23px] left-0 h-[2px] bg-[#CC1414] transition-all duration-200 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="inline-flex items-center gap-2 text-sm text-[#6B6B6B]">
              <Phone className="h-4 w-4" />
              {phoneDisplay}
            </div>
            <a
              href={whatsappHref}
              className="rounded-full bg-[#CC1414] px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#A80F0F]"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#0D0D0D] lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>

        {menuOpen && (
          <div className="w-full border-b border-[#E0DDD8] bg-white lg:hidden">
            <div className="mx-auto w-full max-w-[1280px]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block border-t border-[#E0DDD8] px-6 py-4 text-[15px] ${
                    isActive(item.href) ? "text-[#CC1414]" : "text-[#0D0D0D]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className={`w-full ${menuOpen ? "h-[300px] lg:h-[68px]" : "h-[68px]"}`} />
      <WhatsAppFloatingButton />
    </>
  );
}
