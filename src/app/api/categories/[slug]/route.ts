import { NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

// Kategorie löschen. Bilder bleiben erhalten, verlieren nur die Zuordnung.
export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const store = await readStore();
  if (!store.categories.some((c) => c.slug === params.slug)) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }
  store.categories = store.categories.filter((c) => c.slug !== params.slug);
  for (const img of store.images) {
    if (img.category === params.slug) img.category = "";
  }
  await writeStore(store);
  return NextResponse.json({ ok: true });
}
