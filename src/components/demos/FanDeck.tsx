"use client";

import { useState } from "react";
import type { ImageItem } from "@/lib/store";

function jitter(i: number, spread: number): number {
  const x = Math.sin(i * 999) * 10000;
  return (x - Math.floor(x) - 0.5) * 2 * spread;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Fächer: Klick auf den Stapel spreizt die Karten wie ein Pokerblatt.
// Klick auf eine Karte hebt sie gross in die Mitte, nochmals klicken legt sie zurück.
export default function FanDeck({ images }: { images: ImageItem[] }) {
  const cards = images.slice(0, 7);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const n = cards.length;

  if (n === 0) return <p className="text-sm text-muted">Noch keine Bilder im Ordner.</p>;

  return (
    <div
      className="relative mx-auto h-[560px] w-full max-w-4xl cursor-pointer"
      onClick={() => {
        if (active !== null) setActive(null);
        else setOpen(!open);
      }}
    >
      {cards.map((img, i) => {
        const mid = (n - 1) / 2;
        const angle = open ? (i - mid) * (70 / Math.max(n - 1, 1)) : jitter(i, 2);
        const isActive = active === i;
        return (
          <div
            key={img.id}
            onClick={(e) => {
              e.stopPropagation();
              if (!open) setOpen(true);
              else setActive(isActive ? null : i);
            }}
            className="absolute left-1/2 top-[58%] h-[300px] w-[220px] overflow-hidden rounded-[14px] border-[6px] border-[#efe7d3] bg-[#35322c] shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
            style={{
              transform: isActive
                ? "translate(-50%, -62%) scale(1.5) rotate(0deg)"
                : `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: isActive ? "50% 50%" : "50% 135%",
              zIndex: isActive ? 99 : 10 + i,
              transition: `transform 0.7s ${EASE}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.file} alt={img.title || ""} draggable={false} className="h-full w-full object-cover" />
          </div>
        );
      })}
      <p className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center text-sm text-muted">
        {!open
          ? "Stapel anklicken zum Auffächern"
          : active !== null
            ? "Nochmals klicken zum Zurücklegen"
            : "Karte anklicken zum Vergrössern, daneben klicken zum Schliessen"}
      </p>
    </div>
  );
}
