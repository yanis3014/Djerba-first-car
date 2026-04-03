/** Extrait le public_id complet depuis une URL Cloudinary (upload/image). Sans dépendance au SDK — utilisable côté client. */
export function extractPublicIdFromCloudinaryUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("cloudinary.com")) return null;
    const pathname = u.pathname;
    const marker = "/upload/";
    const uploadIdx = pathname.indexOf(marker);
    if (uploadIdx === -1) return null;
    let rest = pathname.slice(uploadIdx + marker.length);
    const parts = rest.split("/").filter(Boolean);
    let i = 0;
    while (i < parts.length && (parts[i].includes(",") || /^v\d+$/i.test(parts[i]))) {
      i += 1;
    }
    const pathWithExt = parts.slice(i).join("/");
    if (!pathWithExt) return null;
    return pathWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}
