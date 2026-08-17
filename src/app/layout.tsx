import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME } from "@/lib/site";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export function generateMetadata(): Metadata {
  const d = t(getLang());
  return {
    title: `${SITE_NAME} — ${d.meta.homeTitle}`,
    description: d.meta.homeDesc,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang();
  return (
    <html lang={lang}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
