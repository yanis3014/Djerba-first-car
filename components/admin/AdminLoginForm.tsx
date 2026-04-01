"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = fd.get("email")?.toString() ?? "";
        const password = fd.get("password")?.toString() ?? "";
        setError(null);
        startTransition(async () => {
          const supabase = createSupabaseBrowserClient();
          const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
          if (signError) {
            setError(signError.message);
            return;
          }
          router.replace(redirectTo);
          router.refresh();
        });
      }}
    >
      <div>
        <label htmlFor="admin-email" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Mot de passe
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
