"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ImageItem, SelectionMode } from "@/lib/store";
import { SITE_NAME } from "@/lib/site";

type Props = {
  initialImages: ImageItem[];
  initialMode: SelectionMode;
  thisWeekIds: string[];
  nextWeekIds: string[];
};

// Liest die echten Pixelmasse eines Bildes im Browser aus.
function readDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ w: 0, h: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function Dashboard({ initialImages, initialMode, thisWeekIds, nextWeekIds }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const images = initialImages;
  const mode = initialMode;
  const thisWeek = new Set(thisWeekIds);
  const nextWeek = new Set(nextWeekIds);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMsg(`Lade ${files.length} Bild(er) hoch ...`);
    for (const file of Array.from(files)) {
      const { w, h } = await readDimensions(file);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("w", String(w));
      fd.append("h", String(h));
      fd.append("title", "");
      const res = await fetch("/api/images", { method: "POST", body: fd });
      if (!res.ok) {
        setMsg("Fehler beim Hochladen.");
        setBusy(false);
        return;
      }
    }
    if (fileRef.current) fileRef.current.value = "";
    setMsg("");
    setBusy(false);
    router.refresh();
  }

  async function setMode(next: SelectionMode) {
    setBusy(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: next }),
    });
    setBusy(false);
    router.refresh();
  }

  async function move(id: string, dir: "up" | "down") {
    setBusy(true);
    await fetch(`/api/images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move: dir }),
    });
    setBusy(false);
    router.refresh();
  }

  async function rename(id: string, title: string) {
    await fetch(`/api/images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Dieses Bild wirklich löschen?")) return;
    setBusy(true);
    await fetch(`/api/images/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f4f2ee] text-[#1b1a17]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div>
          <div className="text-lg font-semibold uppercase tracking-brand">{SITE_NAME}</div>
          <div className="text-sm text-neutral-500">Bild-Verwaltung</div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="/" target="_blank" className="text-neutral-500 hover:text-neutral-900">
            Website ansehen ↗
          </a>
          <button onClick={logout} className="rounded-lg border border-neutral-200 px-3 py-1.5 hover:bg-white">
            Abmelden
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-20">
        {/* Modus + Upload */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="font-medium">Auswahl pro Woche</h2>
            <p className="mt-1 text-sm text-neutral-500">Wie werden die 4 Bilder gewählt?</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setMode("rotate")}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  mode === "rotate" ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                Rotierend
              </button>
              <button
                onClick={() => setMode("random")}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  mode === "random" ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                Zufällig
              </button>
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              {mode === "rotate"
                ? "Der Reihe nach, jede Woche 4 weiter, dann wieder von vorn."
                : "Jede Woche 4 zufällige Bilder (pro Woche stabil)."}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="font-medium">Bilder-Ordner</h2>
            <p className="mt-1 text-sm text-neutral-500">Neue Bilder hinzufügen (mehrere möglich).</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              disabled={busy}
              onChange={(e) => handleFiles(e.target.files)}
              className="mt-4 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-white"
            />
            <p className="mt-3 text-xs text-neutral-500">{images.length} Bild(er) im Ordner.</p>
          </div>
        </section>

        {msg ? <p className="mt-4 text-sm text-neutral-500">{msg}</p> : null}

        {/* Vorschau dieser Woche */}
        <section className="mt-10">
          <h2 className="font-medium">Diese Woche live</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Genau diese 4 Bilder zeigt die Startseite gerade. Wechselt automatisch jeden Montag.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images
              .filter((i) => thisWeek.has(i.id))
              .map((i) => (
                <div key={i.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.file} alt={i.title || ""} className="h-32 w-full object-contain bg-[#ece8e0]" />
                </div>
              ))}
            {images.length === 0 ? <p className="text-sm text-neutral-500">Noch keine Bilder.</p> : null}
          </div>
        </section>

        {/* Alle Bilder */}
        <section className="mt-10">
          <h2 className="font-medium">Alle Bilder im Ordner</h2>
          <p className="mt-1 text-sm text-neutral-500">Reihenfolge bestimmt (bei „Rotierend") die Abfolge.</p>

          <div className="mt-4 space-y-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.file}
                  alt={img.title || ""}
                  className="h-16 w-16 flex-none rounded-lg object-cover bg-[#ece8e0]"
                />
                <div className="min-w-0 flex-1">
                  <input
                    defaultValue={img.title}
                    placeholder="Titel (optional)"
                    onBlur={(e) => {
                      if (e.target.value !== img.title) rename(img.id, e.target.value);
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-neutral-900"
                  />
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    <span className="text-neutral-500">
                      {img.w && img.h ? `${img.w}×${img.h}px` : "Grösse unbekannt"}
                    </span>
                    {thisWeek.has(img.id) ? (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-800">Diese Woche</span>
                    ) : null}
                    {nextWeek.has(img.id) ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">Nächste Woche</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-none items-center gap-1">
                  <button
                    onClick={() => move(img.id, "up")}
                    disabled={idx === 0 || busy}
                    className="rounded-lg border border-neutral-200 px-2 py-1 text-sm disabled:opacity-30"
                    title="Nach oben"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(img.id, "down")}
                    disabled={idx === images.length - 1 || busy}
                    className="rounded-lg border border-neutral-200 px-2 py-1 text-sm disabled:opacity-30"
                    title="Nach unten"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => remove(img.id)}
                    disabled={busy}
                    className="rounded-lg border border-neutral-200 px-2 py-1 text-sm text-red-700 hover:bg-red-50"
                    title="Löschen"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {images.length === 0 ? (
              <p className="text-sm text-neutral-500">Der Ordner ist leer. Lade oben Bilder hoch.</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
