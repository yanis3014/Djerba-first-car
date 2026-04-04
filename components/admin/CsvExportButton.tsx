"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadObjectsAsCsv } from "@/lib/csv";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown>;

export function CsvExportButton({
  rows,
  filename,
  label = "Exporter en CSV",
  className,
  disabled,
}: {
  rows: Row[];
  filename: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const empty = rows.length === 0;

  return (
    <Button
      type="button"
      variant="secondary"
      className={cn("gap-2", className)}
      disabled={disabled || empty}
      onClick={() => downloadObjectsAsCsv(filename, rows)}
      title={empty ? "Aucune donnée à exporter" : undefined}
    >
      <Download className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </Button>
  );
}
