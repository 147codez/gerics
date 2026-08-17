import path from "path";

// Hochgeladene Bilder liegen ausserhalb von /public (die statische Auslieferung
// zur Laufzeit ist auf dem Node-Host unzuverlässig). Sie werden über
// /api/media/[name] ausgeliefert. Ordner ist gitignored und übersteht Updates.
export const UPLOADS_DIR = path.join(process.cwd(), "uploads-data");

export const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

// URL, unter der ein Bild ausgeliefert wird.
export function mediaUrl(filename: string): string {
  return `/api/media/${filename}`;
}
