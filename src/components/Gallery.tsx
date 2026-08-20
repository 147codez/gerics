"use client";

import { useState } from "react";
import type { ImageItem } from "@/lib/store";
import Lightbox from "./Lightbox";

// Adaptive Galerie. Jedes Bild behält sein Seitenverhältnis (kein Zuschnitt).
// width/height reservieren den Platz korrekt und verhindern Springen.
// Klick auf ein Bild öffnet die sanfte Gross-Ansicht.
export default function Gallery({
  images,
  comingSoon = "",
}: {
  images: ImageItem[];
  comingSoon?: string;
}) {
  const [big, setBig] = useState<ImageItem | null>(null);

  if (images.length === 0) {
    return (
      <div className="gallery" aria-hidden>
        {[
          [4, 3],
          [4, 3],
          [4, 3],
          [4, 3],
          [4, 3],
          [4, 3],
        ].map(([w, h], i) => (
          <figure key={i}>
            <div
              style={{ aspectRatio: `${w} / ${h}` }}
              className="flex items-center justify-center rounded-[14px] bg-[#35353a] text-sm text-muted"
            >
              {comingSoon}
            </div>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="gallery">
      {images.map((img) => (
        <figure key={img.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.file}
            alt={img.title || "Fotografie"}
            width={img.w || undefined}
            height={img.h || undefined}
            loading="lazy"
            onClick={() => setBig(img)}
            className="cursor-zoom-in transition duration-300 hover:scale-[1.015]"
          />
          {img.title ? <figcaption>{img.title}</figcaption> : null}
        </figure>
      ))}
      {big ? (
        <Lightbox src={big.file} alt={big.title || "Fotografie"} onClose={() => setBig(null)} />
      ) : null}
    </div>
  );
}
