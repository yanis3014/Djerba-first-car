/**
 * Regroupe les libellés d'équipements en catégories pour l'affichage détail.
 * Heuristique par mots-clés — les données source sont une simple liste de chaînes.
 */
const SECURITE = [
  "abs",
  "esp",
  "airbag",
  "frein",
  "sécurité",
  "camera",
  "caméra",
  "recul",
  "alarme",
  "isofix",
  "traction",
  "stability",
  "blind",
];

const MULTIMEDIA = [
  "bluetooth",
  "usb",
  "écran",
  "ecran",
  "navigation",
  "gps",
  "radio",
  "apple",
  "android",
  "carplay",
  "auto",
  "multimedia",
  "multimédia",
  "enceinte",
  "son",
  "bose",
  "harman",
];

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function bucketFor(feature: string): "securite" | "multimedia" | "confort" {
  const n = norm(feature);
  if (SECURITE.some((k) => n.includes(k))) return "securite";
  if (MULTIMEDIA.some((k) => n.includes(k))) return "multimedia";
  return "confort";
}

export function groupCarFeatures(features: string[]): {
  confort: string[];
  securite: string[];
  multimedia: string[];
} {
  const confort: string[] = [];
  const securite: string[] = [];
  const multimedia: string[] = [];
  for (const f of features) {
    const t = f.trim();
    if (!t) continue;
    switch (bucketFor(t)) {
      case "securite":
        securite.push(t);
        break;
      case "multimedia":
        multimedia.push(t);
        break;
      default:
        confort.push(t);
    }
  }
  return { confort, securite, multimedia };
}
