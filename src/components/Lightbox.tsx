"use client";

import { useEffect, useState } from "react";

// Sanfte Gross-Ansicht: Hintergrund blendet ein, Bild skaliert weich hoch.
// Klick irgendwo oder Esc schliesst mit derselben Animation rückwärts.
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

  function close() {
    setOpen(false);
    setTimeout(onClose, 280);
  }

  useEffect(() => {
    // kurzer Aufschub, damit der Start-Zustand (klein/transparent) erst gerendert wird
    const id = setTimeout(() => setOpen(true), 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
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
