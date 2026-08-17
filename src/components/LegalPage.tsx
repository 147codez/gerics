import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { t, type Lang } from "@/lib/i18n";

// Gemeinsame Vorlage für Impressum und Datenschutz.
export default function LegalPage({
  lang,
  title,
  sections,
}: {
  lang: Lang;
  title: string;
  sections: { h: string; p: string }[];
}) {
  const d = t(lang);
  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-3xl px-8 py-16">
        <h1 className="font-serif text-4xl text-gold sm:text-5xl">{title}</h1>

        <div className="mt-10 space-y-9">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-serif text-xl text-gold">{s.h}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/90">{s.p}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted">{d.legal.updated}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-muted hover:text-gold">
          ← {d.legal.backHome}
        </Link>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
