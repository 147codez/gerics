// Galerie-Kategorien (Slug = URL-Segment unter /galerie).
// Reine Daten, ohne Server-Abhängigkeiten (auch in Client-Komponenten nutzbar).
export const CATEGORIES = ["sport", "fahrzeuge", "natur", "architektur"] as const;
export type Category = (typeof CATEGORIES)[number];

export function isCategory(v: string): v is Category {
  return (CATEGORIES as readonly string[]).includes(v);
}
