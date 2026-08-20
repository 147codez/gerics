import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readStore, writeStore, sortedImages, isCategory } from "@/lib/store";
import { isAuthed } from "@/lib/auth";
import { UPLOADS_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const store = await readStore();
  const img = store.images.find((i) => i.id === params.id);
  if (!img) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  store.images = store.images.filter((i) => i.id !== params.id);
  await writeStore(store);

  // Datei aus dem Upload-Ordner entfernen.
  if (img.file.startsWith("/api/media/")) {
    await fs.unlink(path.join(UPLOADS_DIR, path.basename(img.file))).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const store = await readStore();
  const list = sortedImages(store);
  const idx = list.findIndex((i) => i.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  // Titel ändern
  if (typeof body.title === "string") {
    list[idx].title = body.title;
  }

  // Kategorie ändern (leer = keine Kategorie)
  if (typeof body.category === "string") {
    list[idx].category = isCategory(body.category) ? body.category : "";
  }

  // Reihenfolge verschieben (up/down) durch Tausch der order-Werte
  if (body.move === "up" && idx > 0) {
    const a = list[idx];
    const b = list[idx - 1];
    [a.order, b.order] = [b.order, a.order];
  }
  if (body.move === "down" && idx < list.length - 1) {
    const a = list[idx];
    const b = list[idx + 1];
    [a.order, b.order] = [b.order, a.order];
  }

  store.images = list;
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
