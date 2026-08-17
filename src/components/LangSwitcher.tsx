"use client";

import { useRouter } from "next/navigation";
import { LANGS, LANG_COOKIE, type Lang } from "@/lib/i18n";

export default function LangSwitcher({ current }: { current: Lang }) {
  const router = useRouter();

  function set(l: Lang) {
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 ? <span className="text-line">·</span> : null}
          <button
            onClick={() => set(l)}
            className={l === current ? "text-gold" : "text-muted hover:text-gold"}
            aria-current={l === current}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
