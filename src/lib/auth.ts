import crypto from "crypto";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "./site";

const SECRET = process.env.SESSION_SECRET || "dev-secret-bitte-in-env-setzen";

// Einfaches, signiertes Token für einen Einzelnutzer (interner Zugang).
export function makeToken(): string {
  return crypto.createHmac("sha256", SECRET).update("gerics-admin").digest("hex");
}

export function checkPassword(pw: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "gerics2026";
  const a = Buffer.from(pw || "");
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Serverseitige Prüfung (Route Handler / Server Components).
export function isAuthed(): boolean {
  const c = cookies().get(COOKIE_NAME)?.value;
  return !!c && c === makeToken();
}
