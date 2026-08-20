"use client";

import { useState } from "react";
import type { ImageItem } from "@/lib/store";
import { SITE_NAME } from "@/lib/site";

// Deterministischer "Zufall" pro Karte, damit der Stapel natürlich verschoben liegt
// (echtes Math.random würde bei jedem Render springen).
function jitter(i: number, spread: number): number {
  const x = Math.sin(i * 999) * 10000;
  return (x - Math.floor(x) - 0.5) * 2 * spread;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Karten-Stapel: Klick auf die oberste Karte wirft sie mit 3D-Flip nach rechts
// auf den Ablage-Stapel (verdeckt) und gibt das nächste Bild frei.
// Klick auf die Ablage holt die letzte Karte zurück.
export default function CardStack({ images }: { images: ImageItem[] }) {
  const cards = images.slice(0, 12);
  const [flown, setFlown] = useState<string[]>([]);

  if (cards.length === 0) {
    return <p className="text-sm text-muted">Noch keine Bilder im Ordner.</p>;
  }

  const remaining = cards.filter((c) => !flown.includes(c.id));
  const topId = remaining[0]?.id ?? null;
  const lastFlownId = flown.length ? flown[flown.length - 1] : null;

  return (
    <div>
      <div
        className="relative mx-auto h-[440px] w-full max-w-3xl sm:h-[480px]"
        style={{ perspective: "1600px" }}
      >
        {cards.map((card, i) => {
          const pileIdx = flown.indexOf(card.id);
          const inPile = pileIdx !== -1;
          const stackPos = inPile ? 0 : remaining.findIndex((c) => c.id === card.id);
          const isTop = !inPile && card.id === topId;
          const isPileTop = card.id === lastFlownId;
          const transform = inPile
            ? `translate(-50%, -50%) translateX(clamp(100px, 24vw, 200px)) translateY(${pileIdx * -1.5}px) rotate(${jitter(i + 100, 6)}deg) rotateY(180deg)`
            : `translate(-50%, -50%) translateX(calc(-1 * clamp(100px, 24vw, 200px))) translateY(${stackPos * 2}px) rotate(${jitter(i, 4)}deg)`;
          return (
            <button
              key={card.id}
              type="button"
              data-ort={inPile ? "ablage" : "stapel"}
              disabled={!isTop && !isPileTop}
              onClick={() => {
                if (isTop) setFlown([...flown, card.id]);
                else if (isPileTop) setFlown(flown.slice(0, -1));
              }}
              aria-label={inPile ? "Letzte Karte zurücknehmen" : "Nächste Karte aufdecken"}
              className={`absolute left-1/2 top-1/2 h-[360px] w-[270px] sm:h-[400px] sm:w-[300px] ${
                isTop || isPileTop ? "cursor-pointer" : "cursor-default"
              }`}
              style={{
                transform,
                zIndex: inPile ? 100 + pileIdx : 90 - stackPos,
                transition: `transform 0.85s ${EASE}`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Vorderseite: Polaroid-Rahmen mit Bild */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[16px] bg-[#efe7d3] p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.file}
                  alt={card.title || ""}
                  draggable={false}
                  className="h-[84%] w-full rounded-[10px] bg-[#35322c] object-cover"
                />
                <p className="mt-2 truncate text-center font-serif text-sm text-[#4a3f2c]">
                  {card.title || `Nr. ${i + 1}`}
                </p>
              </div>
              {/* Rückseite: verdeckte Karte mit Monogramm */}
              <div
                className="absolute inset-0 rounded-[16px] bg-[#2f2b25] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-[#6b5836] shadow-[inset_0_0_0_5px_rgba(107,88,54,0.25)]">
                  <span className="font-serif text-6xl text-gold">G</span>
                  <span className="text-xs uppercase tracking-brand text-muted">{SITE_NAME}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
        <span>
          {remaining.length} im Stapel · {flown.length} abgelegt
        </span>
        {flown.length > 0 ? (
          <button
            onClick={() => setFlown([])}
            className="rounded-full border border-line px-4 py-1.5 transition hover:border-gold hover:text-gold"
          >
            Neu mischen
          </button>
        ) : null}
      </div>
    </div>
  );
}
