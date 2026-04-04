"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Car,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Home,
  Settings,
  UserPlus,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "admin-sidebar-collapsed";

const navLinks = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/voitures", label: "Voitures", icon: Car },
  { href: "/admin/leads", label: "Leads", icon: UserPlus },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
}

function AdminNavLinks({
  collapsed,
  onNavigate,
  className,
  newLeads = 0,
  unreadMessages = 0,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
  newLeads?: number;
  unreadMessages?: number;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {navLinks.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        const badge =
          href === "/admin/leads" ? newLeads : href === "/admin/messages" ? unreadMessages : 0;
        const showBadge = badge > 0;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150",
              collapsed ? "justify-center px-2 py-2.5" : "w-full px-3 py-2.5",
              collapsed && showBadge && "relative",
              active
                ? "bg-[var(--color-bg-alt)] text-[var(--color-text)] shadow-sm"
                : "text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]",
            )}
          >
            <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
            <span className={cn("min-w-0 truncate", collapsed && "sr-only")}>{label}</span>
            {!collapsed && showBadge ? (
              <span
                className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#CC1414] px-1.5 text-[10px] font-bold leading-none text-white"
                aria-label={
                  href === "/admin/leads"
                    ? `${badge} nouveau${badge > 1 ? "x" : ""} lead${badge > 1 ? "s" : ""}`
                    : `${badge} message${badge > 1 ? "s" : ""} non lu${badge > 1 ? "s" : ""}`
                }
              >
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
            {collapsed && showBadge ? (
              <span
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#CC1414]"
                aria-hidden
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminNavFooter({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={cn(
        "mt-auto border-t border-[var(--color-border)] pt-4",
        collapsed && "flex flex-col items-stretch gap-2",
      )}
    >
      <AdminLogoutButton collapsed={collapsed} />
      <Link
        href="/"
        onClick={onNavigate}
        title={collapsed ? "Site public" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-[var(--radius-md)] text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)]",
          collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
        )}
      >
        <Home className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
        <span className={cn(collapsed && "sr-only")}>Site public</span>
      </Link>
    </div>
  );
}

export function AdminShell({
  children,
  newLeads = 0,
  unreadMessages = 0,
}: {
  children: React.ReactNode;
  newLeads?: number;
  unreadMessages?: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const totalNotifications = newLeads + unreadMessages;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 shadow-[var(--shadow-nav)] backdrop-blur-md lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] transition hover:bg-[var(--color-bg-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
              {totalNotifications > 0 ? (
                <span
                  className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#CC1414] ring-2 ring-white"
                  aria-hidden
                />
              ) : null}
              <span className="sr-only">Ouvrir le menu de navigation</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[min(100vw,20rem)] flex-col gap-0 p-0 sm:max-w-[20rem]">
            <SheetHeader className="border-b border-[var(--color-border)] px-6 py-5 text-left">
              <SheetTitle className="text-[var(--color-accent)]">Administration</SheetTitle>
              <SheetDescription className="sr-only">
                Menu de navigation de l&apos;espace administration.
              </SheetDescription>
              <p className="text-xs font-normal text-[var(--color-muted)]">Djerba Car — espace réservé</p>
            </SheetHeader>
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
              <AdminNavLinks
                onNavigate={closeMobile}
                newLeads={newLeads}
                unreadMessages={unreadMessages}
              />
              <AdminNavFooter onNavigate={closeMobile} />
            </div>
          </SheetContent>
        </Sheet>
        <Link
          href="/admin/dashboard"
          className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-[var(--color-accent)]"
        >
          Admin
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={cn(
            "relative hidden h-full min-h-0 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-[width] duration-300 ease-out lg:flex",
            hydrated && collapsed ? "w-[4.5rem]" : "w-56 xl:w-64",
          )}
        >
          <div className="flex min-h-full flex-col px-2 py-6 xl:px-3">
            <div
              className={cn(
                "mb-6 flex items-center",
                hydrated && collapsed ? "justify-center px-0" : "justify-between gap-2 px-2",
              )}
            >
              {!(hydrated && collapsed) && (
                <Link
                  href="/admin/dashboard"
                  className="min-w-0 truncate font-[var(--font-display)] text-xl font-semibold text-[var(--color-accent)]"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={toggleCollapsed}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-transparent text-[var(--color-muted)] transition hover:border-[var(--color-border)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                title={hydrated && collapsed ? "Développer le menu" : "Réduire le menu"}
              >
                {hydrated && collapsed ? (
                  <ChevronRight className="h-4 w-4" aria-hidden />
                ) : (
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                )}
                <span className="sr-only">{hydrated && collapsed ? "Développer le menu" : "Réduire le menu"}</span>
              </button>
            </div>

            <AdminNavLinks
              collapsed={hydrated && collapsed}
              className="min-h-0 flex-1"
              newLeads={newLeads}
              unreadMessages={unreadMessages}
            />
            <AdminNavFooter collapsed={hydrated && collapsed} />
          </div>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--color-bg)] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

