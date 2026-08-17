import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auf der Subdomain dashboard.gerics.ch zeigt die Startseite direkt das Admin-Dashboard
// (das leitet ohne Login automatisch auf /login weiter).
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host.startsWith("dashboard.") && req.nextUrl.pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
