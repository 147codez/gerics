import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

// Sortiert eine Gruppe von Bildern neu: die übergebenen IDs erhalten die
// order-Werte, die sie zusammen schon besitzen, in der neuen Reihenfolge.
// Funktioniert damit für die ganze Liste wie für eine Kategorie-Teilmenge.
export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body.ids;
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((v) => typeof v === "string")) {
    return NextResponse.json({ error: "ids fehlt" }, { status: 400 });
  }

  const store = await readStore();
  const items = ids.map((id) => store.images.find((i) => i.id === id));
  if (items.some((i) => !i)) {
    return NextResponse.json({ error: "Unbekanntes Bild" }, { status: 400 });
  }

  const orders = items.map((i) => i!.order).sort((a, b) => a - b);
  items.forEach((item, idx) => {
    item!.order = orders[idx];
  });
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
