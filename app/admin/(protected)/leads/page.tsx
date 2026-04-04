import { AdminLeadsTable } from "@/components/admin/AdminLeadsTable";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { asCsvRows } from "@/lib/csv";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Lead } from "@/lib/types";

export default async function AdminLeadsPage() {
  let leads: Lead[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false });
    if (error) {
      fetchError = error.message;
    } else if (data) {
      leads = data as Lead[];
    }
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Erreur inconnue";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Leads</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Demandes liées aux véhicules et au formulaire.</p>
        </div>
        {!fetchError ? (
          <CsvExportButton
            rows={asCsvRows(leads)}
            filename="djerba-leads.csv"
            className="shrink-0"
          />
        ) : null}
      </div>

      {fetchError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Table <code className="rounded bg-amber-100 px-1">leads</code> indisponible, colonne{" "}
          <code className="rounded bg-amber-100 px-1">archived</code> manquante ou RLS : {fetchError}
        </p>
      ) : null}

      {!fetchError ? <AdminLeadsTable leads={leads} /> : null}
    </div>
  );
}
