"use client";

import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import type { ImageItem } from "@/lib/store";

// Format-Vorlagen fürs Zuschneiden. "original" = Seitenverhältnis des Bildes.
const FORMATE: { label: string; value: number | "original" }[] = [
  { label: "Original", value: "original" },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
];

// Maximale lange Kante. 0 = Originalauflösung behalten. Es wird nie hochskaliert.
const AUFLOESUNGEN: { label: string; max: number }[] = [
  { label: "Original", max: 0 },
  { label: "4K (3840 px)", max: 3840 },
  { label: "Full HD (1920 px)", max: 1920 },
];

// Bild-Anpassungen. 100 = neutral bei Helligkeit/Kontrast/Sättigung, 0 = neutral bei Schärfe/Klarheit.
type Anpassungen = {
  helligkeit: number;
  kontrast: number;
  saettigung: number;
  schaerfe: number;
  klarheit: number;
};

const NEUTRAL: Anpassungen = { helligkeit: 100, kontrast: 100, saettigung: 100, schaerfe: 0, klarheit: 0 };

const REGLER: { key: keyof Anpassungen; label: string; min: number; max: number }[] = [
  { key: "helligkeit", label: "Helligkeit", min: 50, max: 150 },
  { key: "kontrast", label: "Kontrast", min: 50, max: 150 },
  { key: "saettigung", label: "Sättigung", min: 0, max: 200 },
  { key: "schaerfe", label: "Schärfe", min: 0, max: 100 },
  { key: "klarheit", label: "Klarheit", min: 0, max: 100 },
];

function cssFilter(a: Anpassungen): string {
  return `brightness(${a.helligkeit}%) contrast(${a.kontrast}%) saturate(${a.saettigung}%)`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Weichgezeichnete Kopie eines Canvas als Pixel-Daten (für Unschärfemaske).
function blurredData(source: HTMLCanvasElement, w: number, h: number, radius: number): Uint8ClampedArray {
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const ctx = tmp.getContext("2d");
  if (!ctx) throw new Error("Canvas nicht verfügbar");
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(source, 0, 0);
  return ctx.getImageData(0, 0, w, h).data;
}

// Schneidet den gewählten Bereich aus, wendet Anpassungen an und skaliert höchstens herunter.
// Schärfe/Klarheit = Unschärfemaske: Ergebnis = Bild + (Bild - Weichzeichnung) * Stärke.
// Schärfe nutzt einen kleinen Radius (Kanten), Klarheit einen grossen (lokaler Kontrast).
async function exportCrop(
  src: string,
  area: Area,
  maxEdge: number,
  adj: Anpassungen
): Promise<{ blob: Blob; w: number; h: number }> {
  const img = await loadImage(src);
  let w = Math.round(area.width);
  let h = Math.round(area.height);
  const long = Math.max(w, h);
  if (maxEdge > 0 && long > maxEdge) {
    const s = maxEdge / long;
    w = Math.max(1, Math.round(w * s));
    h = Math.max(1, Math.round(h * s));
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas nicht verfügbar");
  ctx.imageSmoothingQuality = "high";
  ctx.filter = cssFilter(adj);
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);
  ctx.filter = "none";

  if (adj.schaerfe > 0 || adj.klarheit > 0) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const out = imageData.data;
    const orig = new Uint8ClampedArray(out);
    const layers: { blur: Uint8ClampedArray; amount: number }[] = [];
    if (adj.schaerfe > 0) {
      layers.push({ blur: blurredData(canvas, w, h, 1), amount: (adj.schaerfe / 100) * 0.9 });
    }
    if (adj.klarheit > 0) {
      const radius = Math.max(6, Math.round(Math.max(w, h) / 120));
      layers.push({ blur: blurredData(canvas, w, h, radius), amount: (adj.klarheit / 100) * 0.4 });
    }
    for (let i = 0; i < out.length; i += 4) {
      for (const { blur, amount } of layers) {
        out[i] += (orig[i] - blur[i]) * amount;
        out[i + 1] += (orig[i + 1] - blur[i + 1]) * amount;
        out[i + 2] += (orig[i + 2] - blur[i + 2]) * amount;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export fehlgeschlagen"))), "image/jpeg", 0.92)
  );
  return { blob, w, h };
}

export default function ImageEditor({
  image,
  onClose,
  onSaved,
}: {
  image: ImageItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const originalAspect = image.w > 0 && image.h > 0 ? image.w / image.h : 4 / 3;
  const [format, setFormat] = useState<number | "original">("original");
  const [maxEdge, setMaxEdge] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [adj, setAdj] = useState<Anpassungen>(NEUTRAL);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const aspect = format === "original" ? originalAspect : format;
  const angepasst = JSON.stringify(adj) !== JSON.stringify(NEUTRAL);

  async function save() {
    if (!areaPixels) return;
    setBusy(true);
    setError("");
    try {
      const { blob, w, h } = await exportCrop(image.file, areaPixels, maxEdge, adj);
      const fd = new FormData();
      fd.append("file", new File([blob], "zuschnitt.jpg", { type: "image/jpeg" }));
      fd.append("w", String(w));
      fd.append("h", String(h));
      const res = await fetch(`/api/images/${image.id}/file`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Speichern fehlgeschlagen");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Speichern");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl border border-line bg-[#2a2723] p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-ink">Bild bearbeiten</h3>
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-[#35322c]"
          >
            Schliessen ✕
          </button>
        </div>

        {/* Zuschnitt-Fläche mit Live-Vorschau der Farb-Anpassungen */}
        <div className="relative mt-4 h-[44vh] min-h-[260px] overflow-hidden rounded-xl bg-[#1d1b18]">
          <Cropper
            image={image.file}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, px) => setAreaPixels(px)}
            style={{ mediaStyle: { filter: cssFilter(adj) } }}
          />
        </div>

        {/* Zoom */}
        <label className="mt-4 flex items-center gap-3 text-sm text-muted">
          Zoom
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#e2c98f]"
          />
        </label>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {/* Anpassungen */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted">Anpassungen</p>
              {angepasst ? (
                <button
                  onClick={() => setAdj(NEUTRAL)}
                  className="text-xs text-muted underline hover:text-gold"
                >
                  Zurücksetzen
                </button>
              ) : null}
            </div>
            <div className="mt-2 space-y-2">
              {REGLER.map((r) => (
                <label key={r.key} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-20 flex-none">{r.label}</span>
                  <input
                    type="range"
                    min={r.min}
                    max={r.max}
                    step={1}
                    value={adj[r.key]}
                    onChange={(e) => setAdj({ ...adj, [r.key]: Number(e.target.value) })}
                    className="w-full accent-[#e2c98f]"
                  />
                  <span className="w-8 flex-none text-right">{adj[r.key]}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Schärfe und Klarheit sind in der Vorschau nicht sichtbar, sie werden beim Speichern
              angewendet.
            </p>
          </div>

          <div className="space-y-4">
            {/* Format */}
            <div>
              <p className="text-sm text-muted">Format</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {FORMATE.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setFormat(f.value)}
                    className={`rounded-xl border px-3 py-1.5 text-sm ${
                      format === f.value
                        ? "border-gold bg-gold text-paper"
                        : "border-line hover:bg-[#35322c]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auflösung */}
            <div>
              <p className="text-sm text-muted">Auflösung (lange Kante, wird nie hochskaliert)</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AUFLOESUNGEN.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => setMaxEdge(a.max)}
                    className={`rounded-xl border px-3 py-1.5 text-sm ${
                      maxEdge === a.max
                        ? "border-gold bg-gold text-paper"
                        : "border-line hover:bg-[#35322c]"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-line px-5 py-2.5 text-sm hover:bg-[#35322c]"
          >
            Abbrechen
          </button>
          <button
            onClick={save}
            disabled={busy || !areaPixels}
            className="rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-paper hover:brightness-105 disabled:opacity-60"
          >
            {busy ? "Speichert ..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
