import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic";
export const metadata = { title: "Animations-Demos" };

// Interne Übersicht (nirgends verlinkt) aller Animations-Demos.
const DEMOS = [
  {
    href: "/demo-stapel",
    title: "Karten-Stapel",
    text: "Klick wirft die oberste Karte mit 3D-Flip verdeckt auf die Ablage rechts.",
  },
  {
    href: "/demo-faecher",
    title: "Fächer",
    text: "Stapel spreizt sich wie ein Pokerblatt, Karten lassen sich herausheben.",
  },
  {
    href: "/demo-coverflow",
    title: "Cover-Flow",
    text: "3D-Karussell mit gekippten Seiten und Spiegelung, wie früher in iTunes.",
  },
  {
    href: "/demo-explosion",
    title: "Explosion",
    text: "Bild zerspringt in 24 Kacheln, darunter erscheint das nächste.",
  },
  {
    href: "/demo-scroll",
    title: "Scroll-Flug",
    text: "Bilder fliegen beim Scrollen herein, reine CSS-Scroll-Animation.",
  },
];

export default function DemosPage() {
  const lang = getLang();

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />
      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">Intern</p>
        <h1 className="mt-3 font-serif text-4xl text-gold sm:text-5xl">Animations-Demos</h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="rounded-2xl border border-line bg-[#312d27] p-6 transition hover:border-gold"
            >
              <h2 className="font-serif text-2xl text-gold">{d.title}</h2>
              <p className="mt-2 text-sm text-muted">{d.text}</p>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter lang={lang} />
    </main>
  );
}
