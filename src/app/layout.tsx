import type { Metadata } from "next";
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
            {/* eslint-disable-next-line @next/next/next-script-for-ga */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
