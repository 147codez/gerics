import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { readStore } from "@/lib/store";
import { t, type Lang } from "@/lib/i18n";
import LangSwitcher from "./LangSwitcher";
import MobileNav from "./MobileNav";

// Server-Komponente: liest die Kategorien aus dem Store, damit neue Kategorien
// aus dem Dashboard automatisch in Navbar (Desktop-Dropdown + Mobile-Menü) erscheinen.
export default async function SiteHeader({ lang }: { lang: Lang }) {
  const d = t(lang);
  const store = await readStore();
  const categories = store.categories;

  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 w-full max-w-[1500px] px-4 sm:px-6">
      <div className="relative flex items-center justify-between gap-4 rounded-full border border-line/70 bg-[#2a2723]/75 px-5 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.4)] backdrop-blur-md sm:px-7">
        <Link href="/" className="text-lg font-semibold uppercase tracking-brand text-gold">
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted sm:gap-7">
          {/* Desktop-Navigation */}
          <nav className="hidden items-center gap-5 md:flex lg:gap-7">
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
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/galerie/${c.slug}`}
                      className="rounded-xl px-4 py-2.5 hover:bg-[#35322c] hover:text-gold"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {store.settings.servicesEnabled ? (
              <Link href="/dienstleistungen" className="hover:text-gold">
                {d.nav.services}
              </Link>
            ) : null}
            <Link href="/ueber-uns" className="hover:text-gold">
              {d.nav.about}
            </Link>
          </nav>
          <LangSwitcher current={lang} />
          <MobileNav
            categories={categories}
            showServices={store.settings.servicesEnabled}
            labels={{
              start: d.nav.start,
              gallery: d.nav.gallery,
              services: d.nav.services,
              about: d.nav.about,
            }}
          />
        </div>
      </div>
    </header>
  );
}
