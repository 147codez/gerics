import { FLICKR_URL, FLICKR_STATS } from "@/lib/site";
import { t, type Lang } from "@/lib/i18n";
import FlickrStats, { type Stat } from "./FlickrStats";

// Vintage-Karte, zweigeteilt: gewachsenes Archiv (2007-2026) und neues Profil (2026-).
export default function FlickrCard({ lang }: { lang: Lang }) {
  const d = t(lang).flickr;

  const current: Stat[] = FLICKR_STATS.map((s) => ({
    target: s.target,
    kind: s.kind,
    label: d.stats[s.key],
  }));
  const zero: Stat[] = FLICKR_STATS.map((s) => ({
    target: 0,
    kind: "int",
    label: d.stats[s.key],
  }));

  return (
    <div className="vintage-card overflow-hidden rounded-3xl px-6 py-10 text-center sm:px-10 sm:py-12">
      <p className="font-serif text-sm uppercase tracking-[0.28em] text-[#7a603a]">{d.eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl text-[#3f3526] sm:text-4xl">{d.title}</h2>

      <div className="vintage-rule mx-auto mt-6 max-w-md text-lg">◆</div>

      <div className="mt-8 grid gap-8 text-left md:grid-cols-2 md:gap-0">
        {/* Links: gewachsenes Archiv */}
        <div className="md:pr-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7a603a]">{d.leftLabel}</p>
          <div className="mt-1 font-serif text-2xl text-[#3f3526] sm:text-3xl">{d.leftPeriod}</div>

          <div className="mt-6">
            <FlickrStats stats={current} />
          </div>

          <a
            href={FLICKR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-[#3f3526] px-6 py-3 text-sm font-medium text-[#f2ead7] transition hover:bg-[#2f2819]"
          >
            {d.cta}
          </a>
        </div>

        {/* Rechts: neues Profil, vorbereitet */}
        <div className="border-t border-[#7a603a]/25 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7a603a]">{d.rightLabel}</p>
          <div className="mt-1 font-serif text-2xl text-[#3f3526] sm:text-3xl">{d.rightPeriod}</div>

          <div className="mt-6">
            <FlickrStats stats={zero} />
          </div>

          <span className="mt-8 inline-block cursor-default rounded-full border border-[#7a603a]/40 px-6 py-3 text-sm font-medium text-[#7a603a]/80">
            {d.newSoon}
          </span>
        </div>
      </div>
    </div>
  );
}
