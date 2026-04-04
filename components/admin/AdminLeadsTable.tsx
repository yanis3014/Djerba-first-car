"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { Button } from "@/components/ui/button";
import { bulkArchiveLeads, bulkDeleteLeads, bulkMarkLeadsAsTreated } from "@/lib/admin/crm-actions";
import { whatsAppWebUrl } from "@/lib/whatsapp";
import type { Lead } from "@/lib/types";

const typeLabel: Record<string, string> = {
  buy: "Achat",
  sell: "Vente",
  exchange: "Échange",
  info: "Infos",
};

export function AdminLeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [pending, startTransition] = useTransition();

  const ids = useMemo(() => leads.map((l) => l.id), [leads]);

  const allSelected = leads.length > 0 && selected.size === leads.length;
  const someSelected = selected.size > 0 && selected.size < leads.length;

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (leads.length === 0) return new Set();
      if (prev.size === leads.length) return new Set();
      return new Set(ids);
    });
  }, [ids, leads.length]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const selectedList = useMemo(() => [...selected], [selected]);

  function runBulk(
    action: (ids: string[]) => Promise<void>,
    options?: { confirmMessage?: string; successTitle: string; successDescription: (n: number) => string },
  ) {
    if (selectedList.length === 0) return;
    if (options?.confirmMessage && !window.confirm(options.confirmMessage)) return;
    const n = selectedList.length;
    startTransition(async () => {
      try {
        await action(selectedList);
        clearSelection();
        router.refresh();
        if (options) {
          toast.success(options.successTitle, { description: options.successDescription(n) });
        }
      } catch (e) {
        toast.error("Action impossible", {
          description: e instanceof Error ? e.message : "Réessayez ou vérifiez votre connexion.",
        });
      }
    });
  }

  const selectionLabel =
    selected.size === 0
      ? ""
      : selected.size === 1
        ? "1 lead sélectionné"
        : `${selected.size} leads sélectionnés`;

  return (
    <div className="space-y-4">
      {selected.size > 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--color-text)]">{selectionLabel}</p>
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-medium text-[var(--color-muted)] underline-offset-2 hover:text-[var(--color-text)] hover:underline"
          >
            Tout désélectionner
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="text-sm"
            disabled={pending}
            onClick={() =>
              runBulk(bulkMarkLeadsAsTreated, {
                successTitle: "Leads mis à jour",
                successDescription: (count) =>
                  count === 1 ? "Le lead a été marqué comme traité." : `${count} leads marqués comme traités.`,
              })
            }
          >
            Marquer comme traité
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="text-sm"
            disabled={pending}
            onClick={() =>
              runBulk(bulkArchiveLeads, {
                successTitle: "Leads archivés",
                successDescription: (count) =>
                  count === 1 ? "Le lead a été archivé." : `${count} leads ont été archivés.`,
              })
            }
          >
            Archiver
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            disabled={pending}
            onClick={() =>
              runBulk(bulkDeleteLeads, {
                confirmMessage:
                  selected.size === 1
                    ? "Supprimer définitivement ce lead ?"
                    : `Supprimer définitivement ces ${selected.size} leads ?`,
                successTitle: "Leads supprimés",
                successDescription: (count) =>
                  count === 1 ? "Le lead a été supprimé définitivement." : `${count} leads supprimés définitivement.`,
              })
            }
          >
            Supprimer
          </Button>
        </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="w-10 px-3 py-3 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  disabled={leads.length === 0 || pending}
                  className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                  aria-label="Sélectionner tous les leads"
                />
              </th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const wa = whatsAppWebUrl(lead.phone);
              const hasWaDigits = /\d/.test(lead.phone);
              return (
                <tr key={lead.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-3 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggleOne(lead.id)}
                      disabled={pending}
                      className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                      aria-label={`Sélectionner ${lead.name}`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--color-muted)]">
                    {new Date(lead.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`tel:${lead.phone}`} className="text-[var(--color-accent)] hover:underline">
                        {lead.phone}
                      </a>
                      {hasWaDigits ? (
                        <Link
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-green-600 hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-950/40"
                          title="Ouvrir WhatsApp Web"
                          aria-label={`WhatsApp — ${lead.name}`}
                        >
                          <MessageCircle className="h-4 w-4" strokeWidth={2} />
                        </Link>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">{typeLabel[lead.type] ?? lead.type}</td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-[var(--color-muted)]" title={lead.message ?? ""}>
                    {lead.message ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leads.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[var(--color-muted)]">Aucun lead pour le moment.</p>
        ) : null}
      </div>
    </div>
  );
}
