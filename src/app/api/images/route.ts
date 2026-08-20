import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { readStore, writeStore, sortedImages, isCategory, type ImageItem } from "@/lib/store";
import { isAuthed } from "@/lib/auth";
import { UPLOADS_DIR, mediaUrl } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export async function GET() {
  const store = await readStore();
  return NextResponse.json({ settings: store.settings, images: sortedImages(store) });
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const title = String(form.get("title") || "");
  const w = Number(form.get("w") || 0);
  const h = Number(form.get("h") || 0);
  const categoryRaw = String(form.get("category") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Nur Bilddateien erlaubt" }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type] || path.extname(file.name) || ".jpg";
  const id = crypto.randomUUID();
  const filename = `${id}${ext}`;

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buf);

  const store = await readStore();
  const maxOrder = store.images.reduce((m, i) => Math.max(m, i.order), -1);
  const item: ImageItem = {
    id,
    file: mediaUrl(filename),
    w: w > 0 ? w : 0,
    h: h > 0 ? h : 0,
    title,
    order: maxOrder + 1,
    category: isCategory(categoryRaw) ? categoryRaw : "",
  };
  store.images.push(item);
  await writeStore(store);

  return NextResponse.json(item, { status: 201 });
}
