"use client";

import { useState } from "react";
import type { ImageItem } from "@/lib/store";

function jitter(i: number, spread: number): number {
  const x = Math.sin(i * 999) * 10000;
  return (x - Math.floor(x) - 0.5) * 2 * spread;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COLS = 6;
const ROWS = 4;

// Explosion: Klick zerlegt das Bild in Kacheln, die davonfliegen,
// darunter kommt das nächste Bild zum Vorschein.
export default function TileExplosion({ images }: { images: ImageItem[] }) {
  const pics = images.slice(0, 8);
  const [cur, setCur] = useState(0);
  const [exploding, setExploding] = useState(false);

  if (pics.length === 0) return <p className="text-sm text-muted">Noch keine Bilder im Ordner.</p>;

  const next = (cur + 1) % pics.length;

  function boom() {
    if (exploding) return;
    setExploding(true);
    setTimeout(() => {
      setCur((c) => (c + 1) % pics.length);
      setExploding(false);
    }, 900);
  }

  const tiles: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) tiles.push([r, c]);

  return (
    <div>
      <div
        className="relative mx-auto aspect-[3/2] w-full max-w-3xl cursor-pointer select-none"
        onClick={boom}
      >
        {/* Nächstes Bild liegt darunter und wird beim Zerfall sichtbar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pics[next].file}
          alt=""
          draggable={false}
          className={`absolute inset-0 h-full w-full rounded-2xl object-cover transition duration-700 ${
            exploding ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
        {/* Aktuelles Bild als Kachel-Raster */}
        {tiles.map(([r, c], i) => (
          <div
            key={`${cur}-${i}`}
            className="absolute"
            style={{
              left: `${(c / COLS) * 100}%`,
              top: `${(r / ROWS) * 100}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
              backgroundImage: `url(${pics[cur].file})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
              transform: exploding
                ? `translate(${jitter(i, 340)}px, ${jitter(i + 50, 260)}px) rotate(${jitter(
                    i + 99,
                    160
                  )}deg) scale(0.3)`
                : "none",
              opacity: exploding ? 0 : 1,
              transition: `transform 0.8s ${EASE} ${i * 12}ms, opacity 0.8s ${EASE} ${i * 12}ms`,
            }}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        Bild anklicken · {cur + 1} / {pics.length}
      </p>
    </div>
  );
}
