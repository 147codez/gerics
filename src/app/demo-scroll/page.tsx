import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollReveal from "@/components/demos/ScrollReveal";
import { readStore, sortedImages } from "@/lib/store";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Scroll-Flug (Demo)" };

export default async function DemoScrollPage() {
  const lang = getLang();
  const store = await readStore();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />
      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">Demo</p>
        <h1 className="mt-3 font-serif text-4xl text-gold sm:text-5xl">Scroll-Flug</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Einfach nach unten scrollen: die Bilder fliegen abwechselnd von links und rechts herein
          und richten sich auf. Komplett ohne JavaScript, reine CSS-Scroll-Animation.
        </p>
        <ScrollReveal images={sortedImages(store)} />
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
