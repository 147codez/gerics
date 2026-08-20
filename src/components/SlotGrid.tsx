"use client";

import { useState } from "react";
import type { ImageItem } from "@/lib/store";
import Lightbox from "./Lightbox";

const SLOTS = 5;

// 5 feste Slots einer Kategorie auf der Galerie-Übersicht.
// Klick auf ein Bild öffnet die sanfte Gross-Ansicht, leere Slots sind Platzhalter.
export default function SlotGrid({
  images,
  comingSoon,
  alt,
}: {
  images: ImageItem[];
  comingSoon: string;
  alt: string;
}) {
  const [big, setBig] = useState<ImageItem | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: SLOTS }).map((_, i) => {
        const img = images[i];
        return img ? (
          <button
            key={img.id}
            type="button"
            onClick={() => setBig(img)}
            className="group block cursor-zoom-in overflow-hidden rounded-[14px] border border-line/60 bg-[#35322c]"
            style={{ aspectRatio: "4 / 3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.file}
              alt={img.title || alt}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ) : (
          <div
            key={`empty-${i}`}
            style={{ aspectRatio: "4 / 3" }}
            className="flex items-center justify-center rounded-[14px] border border-line/40 bg-[#35322c] text-sm text-muted"
          >
            {comingSoon}
          </div>
        );
      })}
      {big ? (
        <Lightbox src={big.file} alt={big.title || alt} onClose={() => setBig(null)} />
      ) : null}
    </div>
  );
}
