import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
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
        {/* Links: Bild. Rechts: Bio, vertikal mittig. */}
        <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-20">
          {/* Porträt (quadratisch, kein Zuschnitt) */}
          <img
            src="/geri.jpg"
            alt={d.portraitAlt}
            className="w-full rounded-2xl border border-line object-cover shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
          />

          {/* Bio */}
          <div className="space-y-7 text-lg leading-relaxed text-ink/90 lg:text-xl">
            <p>{d.p1}</p>
            <p>{d.p2}</p>
            <p>{d.p3}</p>
          </div>
        </div>

        {/* Kontaktformular unter dem Text */}
        <div
          id="kontakt"
          className="mt-16 scroll-mt-28 rounded-3xl border border-line bg-[#312d27] px-8 py-12 sm:px-14"
        >
          <h2 className="font-serif text-3xl text-gold">{d.contactTitle}</h2>
          <p className="mt-3 max-w-xl text-lg text-ink/90">{d.contactText}</p>
          <div className="max-w-2xl">
            <ContactForm form={d.form} />
          </div>
          <p className="mt-8 text-sm text-muted">
            <a href={`mailto:${SITE_EMAIL}`} className="text-gold hover:underline">
              {SITE_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
