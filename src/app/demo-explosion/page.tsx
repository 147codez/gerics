import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TileExplosion from "@/components/demos/TileExplosion";
import { readStore, sortedImages } from "@/lib/store";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Explosion (Demo)" };

export default async function DemoExplosionPage() {
  const lang = getLang();
  const store = await readStore();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />
      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">Demo</p>
        <h1 className="mt-3 font-serif text-4xl text-gold sm:text-5xl">Explosion</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Klick zerlegt das Bild in 24 Kacheln, die davonfliegen, darunter erscheint das nächste
          Bild.
        </p>
        <div className="mt-10">
          <TileExplosion images={sortedImages(store)} />
        </div>
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
