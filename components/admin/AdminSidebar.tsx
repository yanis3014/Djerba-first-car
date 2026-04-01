"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const links = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/voitures", label: "Voitures" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/stats", label: "Statistiques" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-8 lg:w-64">
      <Link href="/admin/dashboard" className="mb-8 px-2 font-[var(--font-display)] text-xl text-[var(--color-accent)]">
        Admin
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--color-bg-alt)] text-[var(--color-text)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-[var(--color-border)] pt-4">
        <AdminLogoutButton />
        <Link
          href="/"
          className="mt-2 block rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          ← Site public
        </Link>
      </div>
    </aside>
  );
}
