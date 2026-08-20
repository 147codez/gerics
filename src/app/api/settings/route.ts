import { NextResponse } from "next/server";
import { readStore, writeStore, type SelectionMode } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const store = await readStore();

  if (body.mode !== undefined) {
    const mode = body.mode as SelectionMode;
    if (mode !== "rotate" && mode !== "random") {
      return NextResponse.json({ error: "Ungültiger Modus" }, { status: 400 });
    }
    store.settings.mode = mode;
  }
  if (typeof body.weeklyEnabled === "boolean") {
    store.settings.weeklyEnabled = body.weeklyEnabled;
  }

  await writeStore(store);
  return NextResponse.json({ ok: true, settings: store.settings });
}
