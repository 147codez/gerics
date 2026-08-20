import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { readStore, writeStore } from "@/lib/store";
import { isAuthed } from "@/lib/auth";
import { UPLOADS_DIR, mediaUrl } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// Ersetzt die Bilddatei eines bestehenden Eintrags (nach Zuschnitt im Dashboard).
// Neuer Dateiname, damit Browser-Caches nicht das alte Bild zeigen.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const w = Number(form.get("w") || 0);
  const h = Number(form.get("h") || 0);

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Keine Bilddatei" }, { status: 400 });
  }

  const store = await readStore();
  const img = store.images.find((i) => i.id === params.id);
  if (!img) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  const ext = EXT_BY_TYPE[file.type] || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buf);

  const oldFile = img.file;
  img.file = mediaUrl(filename);
  if (w > 0) img.w = w;
  if (h > 0) img.h = h;
  await writeStore(store);

  if (oldFile.startsWith("/api/media/")) {
    await fs.unlink(path.join(UPLOADS_DIR, path.basename(oldFile))).catch(() => {});
  }
  return NextResponse.json(img);
}
