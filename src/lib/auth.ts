import crypto from "crypto";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "./site";

// Passwort und Secret kommen ausschliesslich aus Umgebungsvariablen.
// Sind sie nicht gesetzt, ist das Admin-Login komplett deaktiviert (sicher).
const SECRET = process.env.SESSION_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Signiertes Token für einen Einzelnutzer. null, wenn kein Secret gesetzt ist.
export function makeToken(): string | null {
  if (!SECRET) return null;
  return crypto.createHmac("sha256", SECRET).update("gerics-admin").digest("hex");
}

export function checkPassword(pw: string): boolean {
  if (!ADMIN_PASSWORD || !SECRET) return false;
  const a = Buffer.from(pw || "");
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Serverseitige Prüfung (Route Handler / Server Components).
export function isAuthed(): boolean {
  const token = makeToken();
  if (!token) return false;
  const c = cookies().get(COOKIE_NAME)?.value;
  return !!c && c === token;
}
