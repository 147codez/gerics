"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { ImageItem, SelectionMode } from "@/lib/store";
import { SITE_NAME } from "@/lib/site";
import ImageEditor from "./ImageEditor";

type Props = {
  initialImages: ImageItem[];
  initialMode: SelectionMode;
  initialWeeklyEnabled: boolean;
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

export default function Dashboard({
  initialImages,
  initialMode,
  initialWeeklyEnabled,
  thisWeekIds,
  nextWeekIds,
}: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [zoom, setZoom] = useState(false);
  const [editing, setEditing] = useState<ImageItem | null>(null);

  const images = initialImages;
  const mode = initialMode;
  const weeklyEnabled = initialWeeklyEnabled;
  const thisWeek = new Set(thisWeekIds);
  const nextWeek = new Set(nextWeekIds);

  async function handleFiles(files: FileList | null, category = "") {
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
      fd.append("category", category);
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

  async function setWeeklyEnabled(next: boolean) {
    setBusy(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weeklyEnabled: next }),
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

  async function setCategory(id: string, category: string) {
    await fetch(`/api/images/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
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
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div>
          <div className="text-lg font-semibold uppercase tracking-brand">{SITE_NAME}</div>
          <div className="text-sm text-muted">Bild-Verwaltung</div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="/" target="_blank" className="text-muted hover:text-gold">
            Website ansehen ↗
          </a>
          <button onClick={logout} className="rounded-lg border border-line px-3 py-1.5 hover:bg-[#35322c]">
            Abmelden
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-20">
        {/* Modus + Upload */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-[#312d27] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium">Auswahl pro Woche</h2>
              {/* An/Aus-Schalter: blendet die Wochen-Galerie auf der Startseite ein/aus */}
              <button
                onClick={() => setWeeklyEnabled(!weeklyEnabled)}
                disabled={busy}
                title={weeklyEnabled ? "Wochen-Galerie ausschalten" : "Wochen-Galerie einschalten"}
                className={`relative h-7 w-14 flex-none rounded-full border transition ${
                  weeklyEnabled ? "border-gold bg-gold" : "border-line bg-[#35322c]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-[22px] w-[22px] rounded-full bg-paper shadow transition-all ${
                    weeklyEnabled ? "left-[30px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">
              {weeklyEnabled ? "Wie werden die 4 Bilder gewählt?" : "Ausgeschaltet, die Startseite zeigt keine Wochen-Galerie."}
            </p>
            <div className={`mt-4 flex gap-2 ${weeklyEnabled ? "" : "pointer-events-none opacity-40"}`}>
              <button
                onClick={() => setMode("rotate")}
                disabled={!weeklyEnabled || busy}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  mode === "rotate" ? "border-gold bg-gold text-paper" : "border-line hover:bg-[#35322c]"
                }`}
              >
                Rotierend
              </button>
              <button
                onClick={() => setMode("random")}
                disabled={!weeklyEnabled || busy}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                  mode === "random" ? "border-gold bg-gold text-paper" : "border-line hover:bg-[#35322c]"
                }`}
              >
                Zufällig
              </button>
            </div>
            <p className="mt-3 text-xs text-muted">
              {!weeklyEnabled
                ? "Schalter an: die Startseite zeigt wieder 4 Bilder pro Woche."
                : mode === "rotate"
                  ? "Der Reihe nach, jede Woche 4 weiter, dann wieder von vorn."
                  : "Jede Woche 4 zufällige Bilder (pro Woche stabil)."}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-[#312d27] p-5">
            <h2 className="font-medium">Bilder-Ordner</h2>
            <p className="mt-1 text-sm text-muted">Neue Bilder hinzufügen (mehrere möglich).</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              disabled={busy}
              onChange={(e) => handleFiles(e.target.files)}
              className="mt-4 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:text-paper"
            />
            <p className="mt-3 text-xs text-muted">{images.length} Bild(er) im Ordner.</p>
          </div>
        </section>

        {msg ? <p className="mt-4 text-sm text-muted">{msg}</p> : null}

        {/* Vorschau dieser Woche */}
        <section className="mt-10">
          <h2 className="font-medium">Diese Woche live</h2>
          <p className="mt-1 text-sm text-muted">
            {weeklyEnabled
              ? "Genau diese 4 Bilder zeigt die Startseite gerade. Wechselt automatisch jeden Montag."
              : "Wochen-Galerie ist ausgeschaltet, die Startseite zeigt diese Bilder gerade nicht."}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images
              .filter((i) => thisWeek.has(i.id))
              .map((i) => (
                <div key={i.id} className="overflow-hidden rounded-xl border border-line bg-[#312d27]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.file} alt={i.title || ""} className="h-32 w-full object-contain bg-[#35322c]" />
                </div>
              ))}
            {images.length === 0 ? <p className="text-sm text-muted">Noch keine Bilder.</p> : null}
          </div>
        </section>

        {/* Galerie-Kategorien: gleiche 5 Slots wie auf der Galerie-Seite */}
        <section className="mt-10">
          <h2 className="font-medium">Galerie-Kategorien</h2>
          <p className="mt-1 text-sm text-muted">
            Die ersten 5 Bilder pro Kategorie erscheinen als Slots auf der Galerie-Seite. Upload lädt
            direkt in die Kategorie.
          </p>
          <div className="mt-4 space-y-4">
            {CATEGORIES.map((c) => {
              const catImages = images.filter((i) => i.category === c);
              return (
                <div key={c} className="rounded-2xl border border-line bg-[#312d27] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">
                      {c.charAt(0).toUpperCase() + c.slice(1)}{" "}
                      <span className="text-xs text-muted">({catImages.length})</span>
                    </h3>
                    <label
                      className={`cursor-pointer rounded-lg bg-gold px-4 py-2 text-sm text-paper ${
                        busy ? "opacity-60" : "hover:brightness-105"
                      }`}
                    >
                      Bilder hochladen
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        disabled={busy}
                        onChange={async (e) => {
                          const el = e.currentTarget;
                          await handleFiles(el.files, c);
                          el.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const img = catImages[i];
                      return img ? (
                        <div
                          key={img.id}
                          style={{ aspectRatio: "4 / 3" }}
                          className="group relative overflow-hidden rounded-xl border border-line bg-[#35322c]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.file}
                            alt={img.title || ""}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
                            <button
                              onClick={() => setEditing(img)}
                              disabled={busy}
                              title="Zuschneiden / Format / Auflösung"
                              className="rounded-lg bg-black/55 px-2 py-1 text-sm text-white backdrop-blur-sm hover:bg-black/75"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => setCategory(img.id, "")}
                              disabled={busy}
                              title="Aus Kategorie entfernen (Bild bleibt im Ordner)"
                              className="rounded-lg bg-black/55 px-2 py-1 text-sm text-white backdrop-blur-sm hover:bg-red-900/80"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={`empty-${i}`}
                          style={{ aspectRatio: "4 / 3" }}
                          className="flex items-center justify-center rounded-xl border border-dashed border-line/60 text-xs text-muted"
                        >
                          Bild folgt
                        </div>
                      );
                    })}
                  </div>
                  {catImages.length > 5 ? (
                    <p className="mt-2 text-xs text-muted">
                      +{catImages.length - 5} weitere auf der Kategorie-Seite
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Alle Bilder */}
        <section className="mt-10">
          <h2 className="font-medium">Alle Bilder im Ordner</h2>
          <p className="mt-1 text-sm text-muted">Reihenfolge bestimmt (bei „Rotierend") die Abfolge.</p>

          {/* Kompaktes Raster statt breiter Zeilen: spart Platz und Scrollen */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images.map((img, idx) => (
              <div key={img.id} className="rounded-xl border border-line bg-[#312d27] p-2">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.file}
                    alt={img.title || ""}
                    style={{ aspectRatio: "4 / 3" }}
                    className="w-full rounded-lg bg-[#35322c] object-cover"
                  />
                  <div className="absolute left-1 top-1 flex gap-1">
                    {thisWeek.has(img.id) ? (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] text-green-800">
                        Diese Woche
                      </span>
                    ) : null}
                    {nextWeek.has(img.id) ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                        Nächste Woche
                      </span>
                    ) : null}
                  </div>
                </div>
                <input
                  defaultValue={img.title}
                  placeholder="Titel (optional)"
                  onBlur={(e) => {
                    if (e.target.value !== img.title) rename(img.id, e.target.value);
                  }}
                  className="mt-2 w-full rounded-lg border border-line bg-paper px-2 py-1 text-xs text-ink outline-none placeholder:text-muted focus:border-gold"
                />
                <select
                  defaultValue={img.category || ""}
                  onChange={(e) => setCategory(img.id, e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line bg-paper px-2 py-1 text-xs text-ink outline-none focus:border-gold"
                  title="Galerie-Kategorie"
                >
                  <option value="">Keine Kategorie</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="mt-1.5 flex items-center justify-between gap-1">
                  <span className="truncate text-[10px] text-muted">
                    {img.w && img.h ? `${img.w}×${img.h}` : "?"}
                  </span>
                  <div className="flex flex-none items-center gap-1">
                    <button
                      onClick={() => setEditing(img)}
                      disabled={busy}
                      className="rounded-md border border-line px-1.5 py-0.5 text-xs hover:bg-[#35322c]"
                      title="Zuschneiden / Format / Auflösung"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => move(img.id, "up")}
                      disabled={idx === 0 || busy}
                      className="rounded-md border border-line px-1.5 py-0.5 text-xs disabled:opacity-30"
                      title="Nach vorne"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(img.id, "down")}
                      disabled={idx === images.length - 1 || busy}
                      className="rounded-md border border-line px-1.5 py-0.5 text-xs disabled:opacity-30"
                      title="Nach hinten"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => remove(img.id)}
                      disabled={busy}
                      className="rounded-md border border-line px-1.5 py-0.5 text-xs text-red-700 hover:bg-red-50"
                      title="Löschen"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {images.length === 0 ? (
              <p className="text-sm text-muted">Der Ordner ist leer. Lade oben Bilder hoch.</p>
            ) : null}
          </div>
        </section>

        {/* Persönliche Erinnerung, nur für dich sichtbar */}
        <section className="mt-16 border-t border-line pt-10 text-center">
          <h2 className="font-serif text-2xl text-gold sm:text-3xl">Niemals vergessen, wer du bist.</h2>

          <div className="mt-12 inline-block">
            {/* Nagel + Schnur */}
            <div className="relative mx-auto h-7 w-40">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-muted" />
              <span className="absolute left-1/2 top-[3px] h-7 w-px origin-top rotate-[34deg] bg-muted/50" />
              <span className="absolute left-1/2 top-[3px] h-7 w-px origin-top -rotate-[34deg] bg-muted/50" />
            </div>
            {/* Rahmen mit Passepartout, leicht schräg, klickbar zum Vergrössern */}
            <button
              type="button"
              onClick={() => setZoom(true)}
              title="Zum Vergrössern klicken"
              className="-rotate-1 cursor-zoom-in border-[7px] border-[#6b5836] bg-[#efe7d3] p-2 shadow-[0_28px_50px_rgba(0,0,0,0.6)] transition hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_34px_60px_rgba(0,0,0,0.7)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/geri2.jpg"
                alt="Zeitungsartikel über Mahmoud Geri Geranmayeh"
                className="block w-52 sm:w-56"
              />
            </button>
          </div>
        </section>
      </div>

      {/* Bild-Editor: Zuschnitt, Format, Auflösung */}
      {editing ? (
        <ImageEditor
          image={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      ) : null}

      {/* Lightbox: grosse Ansicht */}
      {zoom ? (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/geri2.jpg"
            alt="Zeitungsartikel über Mahmoud Geri Geranmayeh"
            className="max-h-[92vh] max-w-[92vw] rounded-lg shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Schliessen ✕
          </button>
        </div>
      ) : null}
    </main>
  );
}
