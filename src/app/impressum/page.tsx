import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_NAME } from "@/lib/site";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/lang";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const d = t(getLang());
  return { title: `${d.legal.impressumTitle} — ${SITE_NAME}` };
}

export default function ImpressumPage() {
  const lang = getLang();
  const d = t(lang);
  return <LegalPage lang={lang} title={d.legal.impressumTitle} sections={d.legal.sections.impressum} />;
}
