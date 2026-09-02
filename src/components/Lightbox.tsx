"use client";

import { useEffect, useRef, useState } from "react";

// Sanfte Gross-Ansicht: Hintergrund blendet ein, Bild skaliert weich hoch.
// Klick irgendwo, Esc oder der Zurück-Knopf des Browsers schliesst mit derselben
// Animation rückwärts. Dafür wird beim Öffnen ein History-Eintrag gesetzt, damit
// "Zurück" nur die Gross-Ansicht schliesst und auf der Seite bleibt.
export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pushed = useRef(false); // eigener History-Eintrag gesetzt und noch aktiv

  function fadeOut() {
    setOpen(false);
    setTimeout(onClose, 280);
  }

  function close() {
    if (pushed.current) {
      // Eintrag wieder entfernen, popstate übernimmt das Schliessen
      window.history.back();
    } else {
      fadeOut();
    }
  }

  useEffect(() => {
    // kurzer Aufschub, damit der Start-Zustand (klein/transparent) erst gerendert wird
    const id = setTimeout(() => setOpen(true), 20);

    // Next.js-Router-Zustand mitkopieren, sonst lädt der Router bei popstate die Seite neu
    if (!window.history.state?.lightbox) {
      window.history.pushState({ ...window.history.state, lightbox: true }, "", window.location.href);
    }
    pushed.current = true;

    const onPop = () => {
      pushed.current = false;
      fadeOut();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={close}
      className={`fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`max-h-[92vh] max-w-[92vw] rounded-lg shadow-2xl transition-all duration-300 ease-out ${
          open ? "scale-100 opacity-100" : "scale-[0.88] opacity-0"
        }`}
      />
    </div>
  );
}
