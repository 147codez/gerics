import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";
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
          <nav className="flex items-center gap-5 sm:gap-7">
            <Link href="/" className="hover:text-gold">
              {d.nav.start}
            </Link>
            {/* Galerie mit Kategorien-Dropdown (rein per CSS, hover + Tastatur-Fokus) */}
            <div className="group relative">
              <Link href="/galerie" className="inline-flex items-center gap-1 hover:text-gold">
                {d.nav.gallery}
                <span aria-hidden className="text-[0.6rem] transition-transform group-hover:rotate-180">
                  ▾
                </span>
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="flex min-w-[190px] flex-col rounded-2xl border border-line/70 bg-[#2a2723]/95 p-2 shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur-md">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c}
                      href={`/galerie/${c}`}
                      className="rounded-xl px-4 py-2.5 hover:bg-[#35322c] hover:text-gold"
                    >
                      {d.categories[c]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/dienstleistungen" className="hover:text-gold">
              {d.nav.services}
            </Link>
            <Link href="/ueber-uns" className="hover:text-gold">
              {d.nav.about}
            </Link>
          </nav>
          <LangSwitcher current={lang} />
        </div>
      </div>
    </header>
  );
}
