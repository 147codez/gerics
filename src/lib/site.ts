// Zentraler Ort für Markenname und feste Daten. Texte liegen in i18n.ts.
export const SITE_NAME = "Ger𝓲cs";
export const SITE_EMAIL = "info@gerics.ch";

// Google Analytics 4 Mess-ID (z.B. "G-XXXXXXXXXX"). Leer = Analytics aus.
export const GA_ID = "";

// Flickr-Archiv (Zahlen zentral pflegbar; Beschriftungen kommen aus i18n).
export const FLICKR_URL = "https://www.flickr.com/people/piton/";
export type StatKey = "views" | "favorites" | "tags" | "groups";
export const FLICKR_STATS: { key: StatKey; target: number; kind: "millions" | "int" }[] = [
  { key: "views", target: 5700000, kind: "millions" },
  { key: "favorites", target: 108702, kind: "int" },
  { key: "tags", target: 1527, kind: "int" },
  { key: "groups", target: 512, kind: "int" },
];

export const COOKIE_NAME = "gerics_session";
