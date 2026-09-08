"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Sorgt dafür, dass Links zuverlässig am Ziel landen:
// - Link mit #anker (z.B. /ueber-uns#kontakt) scrollt zum Abschnitt, auch nach Seitenwechsel
// - Link ohne Anker (z.B. "Über mich" in der Navbar) scrollt an den Seitenanfang
// Bei Browser-Zurück/Vorwärts wird nichts gemacht, damit die Scroll-Position erhalten bleibt.
export default function ScrollToHash() {
  const pathname = usePathname();
  const viaHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      viaHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Seitenwechsel per Link: kurz warten, bis die Seite gerendert ist
    let t: ReturnType<typeof setTimeout> | null = null;
    if (viaHistory.current) {
      viaHistory.current = false;
    } else {
      t = setTimeout(go, 80);
    }

    // Klick auf einen Link derselben Seite (z.B. #kontakt -> "Über mich" ohne Anker):
    // Next.js löst dabei keinen Seitenwechsel aus, darum hier selbst scrollen.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      setTimeout(go, 60);
    };
    document.addEventListener("click", onClick);
    return () => {
      if (t) clearTimeout(t);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
