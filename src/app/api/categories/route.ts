import { NextResponse } from "next/server";
import { readStore, writeStore, toCategorySlug } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({ categories: store.categories });
}

// Neue Galerie-Kategorie anlegen (erscheint automatisch in Navbar + /galerie).
export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const label = String(body.label || "").trim();
  if (!label) return NextResponse.json({ error: "Name fehlt" }, { status: 400 });

  const slug = toCategorySlug(label);
  if (!slug) return NextResponse.json({ error: "Ungültiger Name" }, { status: 400 });

  const store = await readStore();
  if (store.categories.some((c) => c.slug === slug)) {
    return NextResponse.json({ error: "Kategorie existiert bereits" }, { status: 409 });
  }
  store.categories.push({ slug, label });
  await writeStore(store);
  return NextResponse.json({ slug, label }, { status: 201 });
}
