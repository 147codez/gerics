import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ServiceBooking from "@/components/ServiceBooking";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Sprache kommt aus dem Cookie

export function generateMetadata(): Metadata {
  return { title: t(getLang()).services.title };
}

export default function DienstleistungenPage() {
  const lang = getLang();
  const d = t(lang).services;

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">{d.title}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-gold sm:text-5xl">
          {d.sub}
        </h1>

        <div className="mt-12">
          <ServiceBooking lang={lang} />
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
