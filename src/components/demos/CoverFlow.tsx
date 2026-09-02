"use client";

import { useState } from "react";
import type { ImageItem } from "@/lib/store";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Cover-Flow: 3D-Karussell wie früher in iTunes. Seitliche Bilder sind gekippt,
// Klick holt sie in die Mitte. Mit Spiegelung nach unten.
export default function CoverFlow({ images }: { images: ImageItem[] }) {
  const pics = images.slice(0, 15);
  const mid = Math.floor(pics.length / 2);
  const [cur, setCur] = useState(mid);

  if (pics.length === 0) return <p className="text-sm text-muted">Noch keine Bilder im Ordner.</p>;

  return (
    <div>
      <div
        className="relative mx-auto h-[420px] w-full max-w-4xl overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {pics.map((img, i) => {
          const d = i - cur;
          const abs = Math.abs(d);
          return (
            <div
              key={img.id}
              onClick={() => setCur(i)}
              className="absolute left-1/2 top-[46%] h-[260px] w-[260px] cursor-pointer sm:h-[300px] sm:w-[300px]"
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 150}px) translateZ(${
                  d === 0 ? 120 : -abs * 140
                }px) rotateY(${d === 0 ? 0 : d < 0 ? 48 : -48}deg)`,
                zIndex: 100 - abs,
                transition: `transform 0.6s ${EASE}`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.file}
                alt={img.title || ""}
                draggable={false}
                className="h-full w-full rounded-xl object-cover shadow-[0_18px_45px_rgba(0,0,0,0.55)]"
                style={{
                  WebkitBoxReflect:
                    "below 10px linear-gradient(transparent 65%, rgba(226, 201, 143, 0.16))",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-col items-center gap-3 text-sm text-muted">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCur((c) => Math.max(0, c - 1))}
            aria-label="Zurück"
            className="rounded-full border border-line px-5 py-2 transition hover:border-gold hover:text-gold"
          >
            ← Zurück
          </button>
          <button
            onClick={() => setCur(mid)}
            aria-label="Zur Mitte"
            className="rounded-full border border-line px-5 py-2 transition hover:border-gold hover:text-gold"
          >
            Mitte
          </button>
          <button
            onClick={() => setCur((c) => Math.min(pics.length - 1, c + 1))}
            aria-label="Vorwärts"
            className="rounded-full border border-line px-5 py-2 transition hover:border-gold hover:text-gold"
          >
            Vorwärts →
          </button>
        </div>
        <span className="tabular-nums">
          {cur + 1} / {pics.length}
        </span>
      </div>
    </div>
  );
}
