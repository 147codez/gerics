import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ServiceBooking from "@/components/ServiceBooking";
import { readStore, sortedServices } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic"; // Sprache aus Cookie, Angebote aus dem CMS

export function generateMetadata(): Metadata {
  return { title: t(getLang()).services.title };
}

export default async function DienstleistungenPage() {
  const lang = getLang();
  const d = t(lang).services;
  const store = await readStore();
  // Shop geschlossen: Seite ist öffentlich nicht erreichbar, bis der
  // Schalter im Dashboard-CMS auf sichtbar steht.
  if (!store.settings.servicesEnabled) redirect("/");
  const services = sortedServices(store).filter((s) => s.active);

  return (
    <main className="min-h-screen">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-[1500px] px-5 sm:px-8 pb-20 pt-12">
        <p className="text-sm uppercase tracking-brand text-muted">{d.title}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-gold sm:text-5xl">
          {d.sub}
        </h1>

        <div className="mt-12">
          <ServiceBooking lang={lang} services={services} availability={store.availability} />
        </div>
      </section>

      <SiteFooter lang={lang} />
    </main>
  );
}
