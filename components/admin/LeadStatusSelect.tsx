"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateLeadStatus } from "@/lib/admin/crm-actions";
import type { Lead } from "@/lib/types";

const labels: Record<Lead["status"], string> = {
  new: "Nouveau",
  contacted: "Contacté",
  closed: "Clôturé",
};

export function LeadStatusSelect({ id, status }: { id: string; status: Lead["status"] }) {
  const router = useRouter();
  const [value, setValue] = useState<Lead["status"]>(status);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setValue(status);
  }, [status]);

  return (
    <select
      disabled={pending}
      value={value}
      onChange={(e) => {
        const v = e.target.value as Lead["status"];
        const previous = value;
        setValue(v);
        startTransition(async () => {
          try {
            await updateLeadStatus(id, v);
            toast.success("Lead mis à jour", { description: `Statut : ${labels[v]}.` });
            router.refresh();
          } catch (err) {
            setValue(previous);
            toast.error("Mise à jour impossible", {
              description: err instanceof Error ? err.message : "Réessayez plus tard.",
            });
          }
        });
      }}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm"
    >
      {(Object.keys(labels) as Lead["status"][]).map((s) => (
        <option key={s} value={s}>
          {labels[s]}
        </option>
      ))}
    </select>
  );
}
