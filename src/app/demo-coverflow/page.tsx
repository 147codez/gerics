import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CoverFlow from "@/components/demos/CoverFlow";
import { readStore, sortedImages } from "@/lib/store";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cover-Flow (Demo)" };

export default async function DemoCoverflowPage() {
  const lang = getLang();
  const store = await readStore();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />
      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">Demo</p>
        <h1 className="mt-3 font-serif text-4xl text-gold sm:text-5xl">Cover-Flow</h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          3D-Karussell wie früher in iTunes: seitliche Bilder sind gekippt, Klick oder die Knöpfe
          holen sie in die Mitte, mit Spiegelung nach unten.
        </p>
        <div className="mt-6">
          <CoverFlow images={sortedImages(store)} />
        </div>
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
