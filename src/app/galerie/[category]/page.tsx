import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollGallery from "@/components/ScrollGallery";
import { readStore, imagesByCategory, isCategory } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Inhalte hängen vom Store + Sprache (Cookie) ab

type Props = { params: { category: string } };

export function generateMetadata({ params }: Props): Metadata {
  if (!isCategory(params.category)) return {};
  return { title: t(getLang()).categories[params.category] };
}

export default async function KategoriePage({ params }: Props) {
  if (!isCategory(params.category)) notFound();
  const category = params.category;

  const lang = getLang();
  const d = t(lang);
  const store = await readStore();
  const images = imagesByCategory(store, category);

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <Link href="/galerie" className="text-sm text-muted hover:text-gold">
          {d.galleryPage.back}
        </Link>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-serif text-4xl text-gold sm:text-5xl">{d.categories[category]}</h1>
          <span className="text-sm text-muted">{d.galleryPage.catSub}</span>
        </div>

        <div className="mt-10">
          <ScrollGallery images={images} comingSoon={d.gallery.comingSoon} />
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
