import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollGallery from "@/components/ScrollGallery";
import { readStore, imagesByCategory } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Inhalte hängen vom Store + Sprache (Cookie) ab

type Props = { params: { category: string } };

export default async function KategoriePage({ params }: Props) {
  const lang = getLang();
  const d = t(lang);
  const store = await readStore();
  const category = store.categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const images = imagesByCategory(store, category.slug);

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-5 pb-20 pt-12 sm:px-8">
        <Link href="/galerie" className="text-sm text-muted hover:text-gold">
          {d.galleryPage.back}
        </Link>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-serif text-3xl text-gold sm:text-5xl">{category.label}</h1>
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
