import { promises as fs } from "fs";
import path from "path";

import { type Category } from "./categories";

export { CATEGORIES, isCategory, type Category } from "./categories";

// Bild im geordneten "Ordner" des Fotografen.
export type ImageItem = {
  id: string;
  file: string; // öffentlicher Pfad, z.B. /uploads/abc.jpg
  w: number; // Originalbreite in px
  h: number; // Originalhöhe in px
  title: string;
  order: number; // Reihenfolge bestimmt die Rotation
  category?: Category | ""; // leer = keiner Kategorie zugeordnet
};

export type SelectionMode = "rotate" | "random";

// Buchbare Dienstleistung, komplett im Dashboard pflegbar.
export type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  price: string; // Freitext, z.B. "ab CHF 250" oder "Abo CHF 90/Monat"
  active: boolean; // inaktiv = nicht auf der Website
  order: number;
};

// Buchbare Zeiten: Wochentage (0=So..6=Sa), Zeitfenster, Slot-Länge.
export type Availability = {
  days: number[];
  from: string; // "09:00"
  to: string; // "18:00"
  slotMinutes: number;
};

export type Store = {
  // weeklyEnabled: Wochen-Galerie auf der Startseite an/aus (Standard an)
  settings: { mode: SelectionMode; weeklyEnabled: boolean };
  images: ImageItem[];
  services: ServiceItem[];
  availability: Availability;
  servicesUpdatedAt: string; // ISO-Zeitpunkt der letzten CMS-Änderung ("Gespeichert")
};

const DEFAULT_AVAILABILITY: Availability = { days: [1, 2, 3, 4, 5], from: "09:00", to: "18:00", slotMinutes: 60 };

// Start-Angebote, im Dashboard änderbar/löschbar.
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "portraet",
    title: "Porträt & Bewerbung",
    desc: "Porträts mit natürlichem Licht, einzeln oder als kleine Serie, auch für Bewerbung und Profil.",
    price: "",
    active: true,
    order: 0,
  },
  {
    id: "events",
    title: "Events & Feiern",
    desc: "Hochzeiten, Geburtstage, Firmenanlässe: unaufdringlich begleitet, ehrlich festgehalten.",
    price: "",
    active: true,
    order: 1,
  },
  {
    id: "auftrag",
    title: "Auftragsarbeiten",
    desc: "Architektur, Fahrzeuge, Produkte oder Reportagen, nach Absprache vor Ort.",
    price: "",
    active: true,
    order: 2,
  },
  {
    id: "prints",
    title: "Fine-Art-Prints",
    desc: "Ausgewählte Motive als hochwertige Drucke, auf Wunsch signiert und gerahmt.",
    price: "",
    active: true,
    order: 3,
  },
];

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

const EMPTY: Store = {
  settings: { mode: "rotate", weeklyEnabled: true },
  images: [],
  services: DEFAULT_SERVICES,
  availability: DEFAULT_AVAILABILITY,
  servicesUpdatedAt: "",
};

export async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.settings) parsed.settings = { mode: "rotate", weeklyEnabled: true };
    if (typeof parsed.settings.weeklyEnabled !== "boolean") parsed.settings.weeklyEnabled = true;
    if (!Array.isArray(parsed.images)) parsed.images = [];
    if (!Array.isArray(parsed.services)) parsed.services = structuredClone(DEFAULT_SERVICES);
    if (!parsed.availability) parsed.availability = { ...DEFAULT_AVAILABILITY };
    if (typeof parsed.servicesUpdatedAt !== "string") parsed.servicesUpdatedAt = "";
    return parsed;
  } catch {
    return structuredClone(EMPTY);
  }
}

export async function writeStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

// Bilder immer nach order sortiert zurückgeben.
export function sortedImages(store: Store): ImageItem[] {
  return [...store.images].sort((a, b) => a.order - b.order);
}

// Alle Bilder einer Kategorie, nach order sortiert.
export function imagesByCategory(store: Store, category: Category): ImageItem[] {
  return sortedImages(store).filter((i) => i.category === category);
}

// Dienstleistungen nach order sortiert.
export function sortedServices(store: Store): ServiceItem[] {
  return [...store.services].sort((a, b) => a.order - b.order);
}
