import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, GA_ID } from "@/lib/site";
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
      <body className="font-sans antialiased">
        {children}
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
