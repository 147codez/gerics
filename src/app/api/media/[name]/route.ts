import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UPLOADS_DIR, CONTENT_TYPES } from "@/lib/uploads";

export const runtime = "nodejs";

// Liefert ein hochgeladenes Bild von der Platte aus.
export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const name = path.basename(params.name); // Schutz gegen ../ Pfad-Traversal
  const ext = path.extname(name).toLowerCase();
  const type = CONTENT_TYPES[ext] || "application/octet-stream";
  try {
    const buf = await fs.readFile(path.join(UPLOADS_DIR, name));
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
