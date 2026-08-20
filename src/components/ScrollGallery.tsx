"use client";

import type { ImageItem } from "@/lib/store";

// Galerie als Scroll-Flug: Bilder fliegen beim Scrollen abwechselnd von links
// und rechts herein (CSS Scroll-Driven Animations, kein JS).
// Browser ohne animation-timeline zeigen die Bilder einfach normal an.
export default function ScrollGallery({
  images,
  comingSoon,
}: {
  images: ImageItem[];
  comingSoon: string;
}) {
  if (images.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{ aspectRatio: "4 / 3" }}
            className="flex items-center justify-center rounded-[14px] bg-[#35353a] text-sm text-muted"
          >
            {comingSoon}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes heim-einflug-links {
          from { opacity: 0; transform: translateX(-38vw) rotate(-16deg) scale(0.7); }
          to { opacity: 1; transform: none; }
        }
        @keyframes heim-einflug-rechts {
          from { opacity: 0; transform: translateX(38vw) rotate(16deg) scale(0.7); }
          to { opacity: 1; transform: none; }
        }
        .heim-einflug {
          animation: heim-einflug-links linear both;
          animation-timeline: view();
          animation-range: entry 0% cover 42%;
        }
        .heim-einflug.rechts { animation-name: heim-einflug-rechts; }
        @media (prefers-reduced-motion: reduce) { .heim-einflug { animation: none; } }
      `}</style>
      <div className="space-y-[12vh] py-[4vh]">
        {images.map((img, i) => (
          <figure key={img.id} className={`heim-einflug ${i % 2 ? "rechts ml-auto" : ""} w-[min(620px,85%)]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.file}
              alt={img.title || "Fotografie"}
              width={img.w || undefined}
              height={img.h || undefined}
              loading="lazy"
              draggable={false}
              className="w-full rounded-2xl border-[8px] border-[#efe7d3] object-cover shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
            />
            {img.title ? (
              <figcaption className="mt-3 text-center font-serif text-sm text-muted">
                {img.title}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </div>
  );
}
