"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/lib/admin/crm-actions";
import type { Lead } from "@/lib/types";

const labels: Record<Lead["status"], string> = {
  new: "Nouveau",
  contacted: "Contacté",
  closed: "Clôturé",
};

export function LeadStatusSelect({ id, status }: { id: string; status: Lead["status"] }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      disabled={pending}
      defaultValue={status}
      onChange={(e) => {
        const v = e.target.value as Lead["status"];
        startTransition(async () => {
          await updateLeadStatus(id, v);
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
