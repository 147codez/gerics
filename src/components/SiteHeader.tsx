import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { readStore } from "@/lib/store";
import { t, type Lang } from "@/lib/i18n";
import LangSwitcher from "./LangSwitcher";
import MobileNav from "./MobileNav";

// Server-Komponente: liest den Store (Schalter Dienstleistungen). Galerie ist ein
// einfacher Link ohne Kategorien-Dropdown.
export default async function SiteHeader({ lang }: { lang: Lang }) {
  const d = t(lang);
  const store = await readStore();

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
            <Link href="/galerie" className="hover:text-gold">
              {d.nav.gallery}
            </Link>
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
