/**
 * Utilitaires CSV pour l’admin : sérialisation d’objets plats et téléchargement côté client (Excel).
 */

/** Prépare des objets typés (Lead, Car, etc.) pour {@link objectsToCsv} / {@link downloadObjectsAsCsv}. */
export function asCsvRows<T extends object>(rows: readonly T[]): Record<string, unknown>[] {
  return rows as unknown as Record<string, unknown>[];
}

function csvCellString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function escapeCsvField(raw: string): string {
  const needsQuotes = /[",\n\r]/.test(raw);
  const escaped = raw.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function collectSortedKeys(rows: ReadonlyArray<Record<string, unknown>>): string[] {
  const keys = new Set<string>();
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      keys.add(k);
    }
  }
  return [...keys].sort((a, b) => a.localeCompare(b, "fr"));
}

/**
 * Convertit un tableau d’objets en une chaîne CSV (séparateur virgule, en-têtes = clés triées).
 * Les valeurs objet / tableau sont sérialisées en JSON dans la cellule.
 */
export function objectsToCsv(rows: ReadonlyArray<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  const keys = collectSortedKeys(rows);
  const header = keys.map((k) => escapeCsvField(k)).join(",");
  const lines = rows.map((row) =>
    keys.map((key) => escapeCsvField(csvCellString(row[key]))).join(","),
  );
  return [header, ...lines].join("\r\n");
}

/**
 * Déclenche le téléchargement du fichier CSV dans le navigateur (UTF-8 avec BOM pour Excel sous Windows).
 */
export function downloadCsv(filename: string, csvContent: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Convertit les lignes en CSV et lance le téléchargement.
 */
export function downloadObjectsAsCsv(filename: string, rows: ReadonlyArray<Record<string, unknown>>): void {
  downloadCsv(filename, objectsToCsv(rows));
}
