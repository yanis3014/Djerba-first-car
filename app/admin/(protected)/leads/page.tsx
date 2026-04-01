import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Lead } from "@/lib/types";

const typeLabel: Record<string, string> = {
  buy: "Achat",
  sell: "Vente",
  exchange: "Échange",
  info: "Infos",
};

export default async function AdminLeadsPage() {
  let leads: Lead[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
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
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Leads</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Demandes liées aux véhicules et au formulaire.</p>
      </div>

      {fetchError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Table <code className="rounded bg-amber-100 px-1">leads</code> indisponible ou RLS : {fetchError}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-[var(--color-muted)]">
                  {new Date(lead.created_at).toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${lead.phone}`} className="text-[var(--color-accent)] hover:underline">
                    {lead.phone}
                  </a>
                </td>
                <td className="px-4 py-3">{typeLabel[lead.type] ?? lead.type}</td>
                <td className="px-4 py-3">
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-[var(--color-muted)]" title={lead.message ?? ""}>
                  {lead.message ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && !fetchError ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--color-muted)]">Aucun lead pour le moment.</p>
        ) : null}
      </div>
    </div>
  );
}
