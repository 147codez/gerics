import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { readStore, imagesByCategory, CATEGORIES } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Inhalte hängen vom Store + Sprache (Cookie) ab

export function generateMetadata(): Metadata {
  return { title: t(getLang()).galleryPage.title };
}

const SLOTS = 5;

export default async function GaleriePage() {
  const lang = getLang();
  const d = t(lang);
  const store = await readStore();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">{d.galleryPage.title}</p>
        <h1 className="mt-3 font-serif text-4xl text-gold sm:text-5xl">{d.galleryPage.sub}</h1>

        <div className="mt-14 space-y-16">
          {CATEGORIES.map((c) => {
            const images = imagesByCategory(store, c).slice(0, SLOTS);
            return (
              <div key={c}>
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-serif text-2xl text-gold sm:text-3xl">{d.categories[c]}</h2>
                  <Link
                    href={`/galerie/${c}`}
                    className="rounded-full border border-line px-5 py-2 text-sm text-ink transition hover:border-gold hover:text-gold"
                  >
                    {d.galleryPage.more}
                  </Link>
                </div>

                {/* 5 feste Slots pro Kategorie, leere Slots als Platzhalter */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {Array.from({ length: SLOTS }).map((_, i) => {
                    const img = images[i];
                    return img ? (
                      <Link
                        key={img.id}
                        href={`/galerie/${c}`}
                        className="group block overflow-hidden rounded-[14px] border border-line/60 bg-[#35322c]"
                        style={{ aspectRatio: "4 / 3" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.file}
                          alt={img.title || d.categories[c]}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      </Link>
                    ) : (
                      <div
                        key={`empty-${i}`}
                        style={{ aspectRatio: "4 / 3" }}
                        className="flex items-center justify-center rounded-[14px] border border-line/40 bg-[#35322c] text-sm text-muted"
                      >
                        {d.gallery.comingSoon}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
