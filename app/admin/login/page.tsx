import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

function LoginMessages({ error }: { error?: string }) {
  if (error === "forbidden") {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Ce compte n’a pas les droits administrateur. Demandez un rôle <code className="rounded bg-amber-100 px-1">admin</code> dans Supabase
        ou ajoutez votre email dans <code className="rounded bg-amber-100 px-1">ADMIN_EMAILS</code>.
      </p>
    );
  }
  if (error === "config") {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Configuration Supabase manquante : définissez <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
        <code className="rounded bg-red-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
      </p>
    );
  }
  return null;
}

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string; redirect?: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Connexion admin</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Accès réservé à l’équipe Djerba First Car.</p>
        </div>
        <LoginMessages error={searchParams.error} />
        <Suspense fallback={<p className="text-sm text-[var(--color-muted)]">Chargement…</p>}>
          <AdminLoginForm />
        </Suspense>
        <p className="text-center text-sm text-[var(--color-muted)]">
          <Link href="/" className="text-[var(--color-accent)] hover:underline">
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
