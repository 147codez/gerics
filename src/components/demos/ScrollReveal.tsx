"use client";

import type { ImageItem } from "@/lib/store";

// Scroll-Animation ohne JavaScript: CSS Scroll-Driven Animations (animation-timeline: view()).
// Jedes Bild fliegt beim Scrollen von der Seite herein und richtet sich auf.
export default function ScrollReveal({ images }: { images: ImageItem[] }) {
  const pics = images.slice(0, 10);

  if (pics.length === 0) return <p className="text-sm text-muted">Noch keine Bilder im Ordner.</p>;

  return (
    <div>
      <style>{`
        @keyframes einflug-links {
          from { opacity: 0; transform: translateX(-38vw) rotate(-16deg) scale(0.7); }
          to { opacity: 1; transform: none; }
        }
        @keyframes einflug-rechts {
          from { opacity: 0; transform: translateX(38vw) rotate(16deg) scale(0.7); }
          to { opacity: 1; transform: none; }
        }
        .einflug {
          animation: einflug-links linear both;
          animation-timeline: view();
          animation-range: entry 0% cover 42%;
        }
        .einflug.rechts { animation-name: einflug-rechts; }
        @media (prefers-reduced-motion: reduce) { .einflug { animation: none; } }
      `}</style>
      <div className="space-y-[14vh] py-[6vh]">
        {pics.map((img, i) => (
          <div key={img.id} className={`einflug ${i % 2 ? "rechts ml-auto" : ""} w-[min(560px,82%)]`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.file}
              alt={img.title || ""}
              draggable={false}
              className="w-full rounded-2xl border-[8px] border-[#efe7d3] object-cover shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
