import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { t, type Lang } from "@/lib/i18n";
import LangSwitcher from "./LangSwitcher";

export default function SiteHeader({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 w-full max-w-[1500px] px-4 sm:px-6">
      <div className="flex items-center justify-between gap-4 rounded-full border border-line/70 bg-[#2a2723]/75 px-5 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.4)] backdrop-blur-md sm:px-7">
        <Link href="/" className="text-lg font-semibold uppercase tracking-brand text-gold">
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted sm:gap-7">
          <nav className="flex gap-5 sm:gap-7">
            <Link href="/" className="hover:text-gold">
              {d.nav.start}
            </Link>
            <Link href="/ueber-uns" className="hover:text-gold">
              {d.nav.about}
            </Link>
            <Link href="/ueber-uns#kontakt" className="hover:text-gold">
              {d.nav.contact}
            </Link>
          </nav>
          <LangSwitcher current={lang} />
        </div>
      </div>
    </header>
  );
}
