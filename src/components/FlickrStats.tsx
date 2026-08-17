"use client";

import { useEffect, useRef, useState } from "react";

export type Stat = { target: number; label: string; kind: "millions" | "int" };

function format(n: number, kind: "millions" | "int") {
  if (kind === "millions") {
    return (
      (n / 1_000_000).toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + " Mio."
    );
  }
  return Math.round(n).toLocaleString("de-DE");
}

// Zahlen zählen beim ersten Sichtbarwerden von 0 auf ihren Zielwert hoch.
export default function FlickrStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const started = useRef(false);
  const [p, setP] = useState(0); // Fortschritt 0..1

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1600;
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / duration);
        setP(1 - Math.pow(1 - k, 3)); // sanftes Ausklingen
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) run();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-6">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="font-serif text-3xl tabular-nums text-[#3f3526] sm:text-4xl">
            {format(s.target * p, s.kind)}
          </dt>
          <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-[#7a603a]">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
