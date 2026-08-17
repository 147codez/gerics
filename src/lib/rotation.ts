import type { ImageItem, SelectionMode } from "./store";

// Fortlaufender Wochenindex ab Montag, 5. Jan 1970 (ein Montag).
// So sind Wochen weltweit gleich und wechseln jeden Montag um 00:00 UTC.
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const EPOCH = Date.UTC(1970, 0, 5);

export function weekIndex(date: Date = new Date()): number {
  return Math.floor((date.getTime() - EPOCH) / WEEK_MS);
}

// Deterministischer Zufalls-Generator, damit "zufällig" pro Woche stabil bleibt.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Wählt genau die 4 Bilder dieser Woche.
// - rotate: der Reihe nach, jede Woche 4 weiter (mit Umlauf).
// - random: pro Woche stabile Zufallsauswahl (Seed = Wochenindex).
export function selectWeekly(
  images: ImageItem[],
  mode: SelectionMode,
  count = 4,
  wk: number = weekIndex()
): ImageItem[] {
  const n = images.length;
  if (n === 0) return [];
  if (n <= count) return images;

  if (mode === "random") {
    return seededShuffle(images, wk >>> 0).slice(0, count);
  }

  // rotate
  const start = (wk * count) % n;
  const out: ImageItem[] = [];
  for (let i = 0; i < count; i++) {
    out.push(images[(start + i) % n]);
  }
  return out;
}
