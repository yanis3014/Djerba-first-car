"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.signOut();
          router.replace("/admin/login");
          router.refresh();
        });
      }}
      className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-60"
    >
      {pending ? "Déconnexion…" : "Déconnexion"}
    </button>
  );
}
