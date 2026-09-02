import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Gallery from "@/components/Gallery";
import CoverFlow from "@/components/demos/CoverFlow";
import FlickrCard from "@/components/FlickrCard";
import { readStore, sortedImages } from "@/lib/store";
import { selectWeekly } from "@/lib/rotation";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Auswahl hängt vom Datum + Sprache (Cookie) ab

export default async function Home() {
  const lang = getLang();
  const d = t(lang).home;
  const store = await readStore();
  const images = sortedImages(store);
  const weekly = selectWeekly(images, store.settings.mode);

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      {/* Hero mit rotierender Münze (Video), füllt den ersten Bildschirm */}
      <section className="mx-auto max-w-[1500px] px-5 sm:px-8 pb-16 pt-4">
        <div className="relative overflow-hidden rounded-[28px] border border-line">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero-coin.mp4"
            poster="/hero-coin-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
          {/* Abdunklung für Textlesbarkeit: links dunkel, rechts offen */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a2723] via-[#2a2723]/80 to-[#2a2723]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a2723]/90 via-transparent to-transparent" />

          <div className="relative flex min-h-[calc(100svh-6.75rem)] max-w-2xl flex-col justify-center px-6 pb-36 pt-16 sm:px-12 sm:py-16">
            <p className="text-sm uppercase tracking-brand text-muted">{d.eyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-gold sm:text-6xl lg:text-7xl">
              {d.headline}
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-ink/90 sm:text-xl">{d.intro}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/ueber-uns"
                className="rounded-full bg-gold px-6 py-3 font-medium text-paper transition hover:brightness-105"
              >
                {d.aboutBtn}
              </Link>
              <Link
                href="/ueber-uns#kontakt"
                className="rounded-full border border-line px-6 py-3 font-medium text-ink transition hover:border-gold"
              >
                {d.contactBtn}
              </Link>
            </div>
          </div>

          {/* Entdecken-Hinweis mit pulsierendem Strich, nah an der unteren Kante */}
          <a
            href="#galerie"
            aria-label={d.discover}
            className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-6 sm:gap-2.5 text-gold transition hover:opacity-80"
          >
            <span className="text-sm font-medium uppercase tracking-[0.22em] sm:text-lg">
              {d.discover}
            </span>
            <span className="discover-line" aria-hidden />
          </a>
        </div>
      </section>

      {/* Galerie der Woche (zweiter Bildschirm), per Dashboard-Schalter abschaltbar */}
      {store.settings.weeklyEnabled ? (
        <section id="galerie" className="mx-auto max-w-[1500px] scroll-mt-24 px-5 pb-20 pt-6 sm:px-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-2xl text-gold">{d.galleryTitle}</h2>
            <span className="text-sm text-muted">{d.gallerySub}</span>
          </div>
          <Gallery images={weekly} comingSoon={t(lang).gallery.comingSoon} />
        </section>
      ) : null}

      {/* Cover-Flow-Karussell über alle Bilder */}
      {images.length > 0 ? (
        <section className="mx-auto max-w-[1500px] px-5 sm:px-8 pb-20">
          <CoverFlow images={images} />
        </section>
      ) : null}

      {/* Vintage-Karte: Flickr-Archiv (übernimmt den Entdecken-Anker, wenn die Wochen-Galerie aus ist) */}
      <section
        id={store.settings.weeklyEnabled ? undefined : "galerie"}
        className="mx-auto max-w-[1500px] scroll-mt-24 px-5 pb-20 sm:px-8"
      >
        <FlickrCard lang={lang} />
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
