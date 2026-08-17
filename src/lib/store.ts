import { promises as fs } from "fs";
import path from "path";

// Bild im geordneten "Ordner" des Fotografen.
export type ImageItem = {
  id: string;
  file: string; // öffentlicher Pfad, z.B. /uploads/abc.jpg
  w: number; // Originalbreite in px
  h: number; // Originalhöhe in px
  title: string;
  order: number; // Reihenfolge bestimmt die Rotation
};

export type SelectionMode = "rotate" | "random";

export type Store = {
  settings: { mode: SelectionMode };
  images: ImageItem[];
};

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

const EMPTY: Store = { settings: { mode: "rotate" }, images: [] };

export async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!parsed.settings) parsed.settings = { mode: "rotate" };
    if (!Array.isArray(parsed.images)) parsed.images = [];
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
