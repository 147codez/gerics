import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./i18n";

// Aktuelle Sprache aus dem Cookie lesen (Standard: Deutsch). Nur serverseitig.
export function getLang(): Lang {
  const c = cookies().get(LANG_COOKIE)?.value;
  return c === "en" ? "en" : "de";
}
