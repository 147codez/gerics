import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SlotGrid from "@/components/SlotGrid";
import { readStore, imagesByCategory } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Inhalte hängen vom Store + Sprache (Cookie) ab

export function generateMetadata(): Metadata {
  return { title: t(getLang()).galleryPage.title };
}

export default async function GaleriePage() {
  const lang = getLang();
  const d = t(lang);
  const store = await readStore();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-5 pb-20 pt-12 sm:px-8">
        <p className="text-sm uppercase tracking-brand text-muted">{d.galleryPage.title}</p>
        <h1 className="mt-3 font-serif text-3xl text-gold sm:text-5xl">{d.galleryPage.sub}</h1>

        <div className="mt-10 space-y-14 sm:mt-14 sm:space-y-16">
          {store.categories.map((c) => {
            const images = imagesByCategory(store, c.slug).slice(0, 5);
            return (
              <div key={c.slug}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-serif text-2xl text-gold sm:text-3xl">{c.label}</h2>
                  <Link
                    href={`/galerie/${c.slug}`}
                    className="rounded-full border border-line px-5 py-2 text-sm text-ink transition hover:border-gold hover:text-gold"
                  >
                    {d.galleryPage.more}
                  </Link>
                </div>

                {/* 5 feste Slots pro Kategorie, Klick öffnet die Gross-Ansicht */}
                <SlotGrid images={images} comingSoon={d.gallery.comingSoon} alt={c.label} />
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
