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

  // Verfügbarkeit fürs Buchungs-CMS
  if (body.availability && typeof body.availability === "object") {
    const a = body.availability;
    const days = Array.isArray(a.days)
      ? a.days.filter((d: unknown) => typeof d === "number" && d >= 0 && d <= 6)
      : null;
    const timeOk = (v: unknown) => typeof v === "string" && /^\d{2}:\d{2}$/.test(v);
    const slotOk = [30, 60, 90, 120].includes(Number(a.slotMinutes));
    if (!days || !timeOk(a.from) || !timeOk(a.to) || !slotOk) {
      return NextResponse.json({ error: "Ungültige Verfügbarkeit" }, { status: 400 });
    }
    store.availability = { days, from: a.from, to: a.to, slotMinutes: Number(a.slotMinutes) };
    store.servicesUpdatedAt = new Date().toISOString();
  }

  await writeStore(store);
  return NextResponse.json({ ok: true, settings: store.settings });
}
