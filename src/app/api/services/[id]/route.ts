import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

// Dienstleistung ändern (Titel, Beschreibung, Preis, aktiv).
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const store = await readStore();
  const item = store.services.find((s) => s.id === params.id);
  if (!item) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  if (typeof body.title === "string") item.title = body.title.trim();
  if (typeof body.desc === "string") item.desc = body.desc.trim();
  if (typeof body.price === "string") item.price = body.price.trim();
  if (typeof body.imageCount === "string") item.imageCount = body.imageCount.trim();
  if (typeof body.features === "string") item.features = body.features;
  if (typeof body.active === "boolean") item.active = body.active;

  store.servicesUpdatedAt = new Date().toISOString();
  await writeStore(store);
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const store = await readStore();
  if (!store.services.some((s) => s.id === params.id)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }
  store.services = store.services.filter((s) => s.id !== params.id);
  store.servicesUpdatedAt = new Date().toISOString();
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
