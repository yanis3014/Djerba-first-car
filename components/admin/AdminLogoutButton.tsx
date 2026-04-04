"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";

export function AdminLogoutButton({ collapsed }: { collapsed?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title={collapsed ? "Déconnexion" : undefined}
      onClick={() => {
        startTransition(async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          router.replace("/admin/login");
          router.refresh();
        });
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-60",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5 text-left",
      )}
    >
      <LogOut className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
      <span className={cn(collapsed && "sr-only")}>{pending ? "Déconnexion…" : "Déconnexion"}</span>
    </button>
  );
}
