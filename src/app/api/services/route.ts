import { NextResponse } from "next/server";
import crypto from "crypto";
import { readStore, writeStore, sortedServices, type ServiceItem } from "@/lib/store";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({
    services: sortedServices(store),
    availability: store.availability,
    servicesUpdatedAt: store.servicesUpdatedAt,
  });
}

// Neue Dienstleistung anlegen (Dashboard-CMS).
export async function POST() {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const store = await readStore();
  const maxOrder = store.services.reduce((m, s) => Math.max(m, s.order), -1);
  const item: ServiceItem = {
    id: crypto.randomUUID(),
    title: "Neue Dienstleistung",
    desc: "",
    price: "",
    active: false,
    order: maxOrder + 1,
  };
  store.services.push(item);
  store.servicesUpdatedAt = new Date().toISOString();
  await writeStore(store);
  return NextResponse.json(item, { status: 201 });
}
