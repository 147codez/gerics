"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryDef } from "@/lib/store";

// Mobile-Menü: Hamburger-Knopf, aufklappbares Panel mit allen Seiten + Kategorien.
export default function MobileNav({
  categories,
  showServices,
  labels,
}: {
  categories: CategoryDef[];
  showServices: boolean;
  labels: { start: string; gallery: string; services: string; about: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menü"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-gold"
      >
        {open ? "✕" : "☰"}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 px-4">
          <nav className="flex flex-col rounded-2xl border border-line/70 bg-[#2a2723]/95 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <Link href="/" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 hover:bg-[#35322c]">
              {labels.start}
            </Link>
            <Link
              href="/galerie"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 hover:bg-[#35322c]"
            >
              {labels.gallery}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/galerie/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2.5 pl-8 text-sm text-muted hover:bg-[#35322c] hover:text-gold"
              >
                {c.label}
              </Link>
            ))}
            {showServices ? (
              <Link
                href="/dienstleistungen"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-[#35322c]"
              >
                {labels.services}
              </Link>
            ) : null}
            <Link
              href="/ueber-uns"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 hover:bg-[#35322c]"
            >
              {labels.about}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
