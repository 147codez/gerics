import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CardStack from "@/components/CardStack";
import { readStore, sortedImages } from "@/lib/store";
import { getLang } from "@/lib/lang";

// Interne Demo-Seite (nirgends verlinkt): Karten-Stapel-Animation zum Ausprobieren.
export const dynamic = "force-dynamic";
export const metadata = { title: "Karten-Stapel (Demo)" };

export default async function DemoStapelPage() {
  const lang = getLang();
  const store = await readStore();
  const images = sortedImages(store);

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">Demo</p>
        <h1 className="mt-3 font-serif text-4xl text-gold sm:text-5xl">Karten-Stapel</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Oberste Karte anklicken: sie fliegt mit Dreh nach rechts auf die Ablage und liegt dort
          verdeckt, das nächste Bild erscheint. Klick auf die Ablage holt die letzte Karte zurück.
        </p>

        <div className="mt-10">
          <CardStack images={images} />
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
