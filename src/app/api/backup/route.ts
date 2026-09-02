import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthed } from "@/lib/auth";
import { UPLOADS_DIR } from "@/lib/uploads";
import { zipStream, type ZipEntry } from "@/lib/zip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");
const PUBLIC_UPLOADS = path.join(process.cwd(), "public", "uploads");

// Komplett-Backup als ZIP: store.json (Kategorien, Zuordnung, Angebote) + alle Bilder.
// Zum Wiederherstellen: ZIP entpacken und die Ordner data/, uploads-data/ und
// public/uploads/ auf dem Server ersetzen, danach Neustart.
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const entries: ZipEntry[] = [];

  try {
    const st = await fs.stat(DATA_FILE);
    entries.push({ name: "data/store.json", mtime: st.mtime, read: () => fs.readFile(DATA_FILE) });
  } catch {
    // kein Store vorhanden, Backup enthält dann nur Bilder
  }

  for (const [dir, prefix] of [
    [UPLOADS_DIR, "uploads-data/"],
    [PUBLIC_UPLOADS, "public/uploads/"],
  ] as const) {
    let names: string[] = [];
    try {
      names = (await fs.readdir(dir)).filter((n) => !n.startsWith("."));
    } catch {
      continue;
    }
    for (const n of names.sort()) {
      const full = path.join(dir, n);
      const st = await fs.stat(full);
      if (!st.isFile()) continue;
      entries.push({ name: prefix + n, mtime: st.mtime, read: () => fs.readFile(full) });
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(zipStream(entries), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="gerics-backup-${stamp}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
