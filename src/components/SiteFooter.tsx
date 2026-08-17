import Link from "next/link";
import { SITE_NAME, SITE_EMAIL } from "@/lib/site";
import { t, type Lang } from "@/lib/i18n";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const d = t(lang);
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto max-w-[1500px] px-8 py-12 text-sm text-muted">
      <div className="space-y-4 border-t border-line pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {SITE_NAME}. {d.footer.rights}
          </span>
          <div className="flex flex-wrap gap-6">
            <Link href="/impressum" className="hover:text-gold">
              {d.footer.impressum}
            </Link>
            <Link href="/datenschutz" className="hover:text-gold">
              {d.footer.privacy}
            </Link>
            <a href={`mailto:${SITE_EMAIL}`} className="hover:text-gold">
              {SITE_EMAIL}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs text-muted/80 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {SITE_NAME} — {d.footer.imagesCopyright}
          </span>
          <a
            href="https://147codez.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80"
          >
            {d.footer.builtBy}{" "}
            <span className="bg-gradient-to-r from-[#22a7ff] to-[#8b5cf6] bg-clip-text font-semibold text-transparent">
              147codez
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
