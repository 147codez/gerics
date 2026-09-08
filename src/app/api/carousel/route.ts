import { NextResponse } from "next/server";
import { readStore, writeStore, CAROUSEL_MAX } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

// Setzt die Bild-Auswahl und Reihenfolge des Startseiten-Karussells (max. 15 IDs).
export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body.ids;
  if (!Array.isArray(ids) || !ids.every((v) => typeof v === "string")) {
    return NextResponse.json({ error: "ids fehlt" }, { status: 400 });
  }

  const store = await readStore();
  const clean = (ids as string[])
    .filter((id, i, arr) => arr.indexOf(id) === i && store.images.some((img) => img.id === id))
    .slice(0, CAROUSEL_MAX);
  store.carousel = clean;
  await writeStore(store);
  return NextResponse.json({ ok: true, carousel: clean });
}
