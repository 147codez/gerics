import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME, SITE_EMAIL } from "@/lib/site";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const d = t(getLang());
  return { title: `${d.meta.aboutTitle} — ${SITE_NAME}` };
}

export default function UeberUns() {
  const lang = getLang();
  const d = t(lang).about;

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-8 py-16">
        {/* Kopf */}
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-brand text-muted">{d.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-gold sm:text-5xl lg:text-6xl">
            {d.heading}
          </h1>
        </div>

        {/* Links: Bild + Kontakt (gleiche Grösse). Rechts: Bio, vertikal mittig. */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-20">
          <div className="space-y-8">
            {/* Porträt (quadratisch, kein Zuschnitt) */}
            <img
              src="/geri.jpg"
              alt={d.portraitAlt}
              className="w-full rounded-2xl border border-line object-cover shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
            />

            {/* Kontakt, exakt so gross wie das Bild */}
            <div
              id="kontakt"
              className="w-full rounded-2xl border border-line bg-[#312d27] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
            >
              <h2 className="font-serif text-3xl text-gold">{d.contactTitle}</h2>
              <p className="mx-auto mt-3 max-w-xs text-lg text-ink/90">{d.contactText}</p>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="mx-auto mt-6 inline-block rounded-full bg-gold px-7 py-3 font-medium text-paper transition hover:brightness-105"
              >
                {SITE_EMAIL}
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-7 text-lg leading-relaxed text-ink/90 lg:text-xl">
            <p>{d.p1}</p>
            <p>{d.p2}</p>
            <p>{d.p3}</p>
          </div>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
