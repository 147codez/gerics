"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

// Dienstleistungen mit Anfrage-Formular (Stufe 1 des Buchungssystems):
// Karte wählen -> Formular mit vorausgewählter Dienstleistung + Wunschtermin,
// Versand über die bestehende Kontakt-API (E-Mail an info@gerics.ch).
export default function ServiceBooking({ lang }: { lang: Lang }) {
  const d = t(lang).services;
  const f = t(lang).about.form;
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  function pick(h: string) {
    setService(h);
    setState("idle");
    document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, message, service, date }),
    }).catch(() => null);
    if (res?.ok) {
      setState("ok");
      setDate("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } else {
      setState("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-[#312d27] px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-gold";

  return (
    <div>
      {/* Angebots-Karten */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.items.map((item) => (
          <div
            key={item.h}
            className={`flex flex-col rounded-2xl border bg-[#312d27] p-6 transition ${
              service === item.h ? "border-gold" : "border-line hover:border-gold/50"
            }`}
          >
            <h2 className="font-serif text-2xl text-gold">{item.h}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.p}</p>
            <button
              onClick={() => pick(item.h)}
              className="mt-5 rounded-full border border-line px-5 py-2 text-sm text-ink transition hover:border-gold hover:text-gold"
            >
              {d.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Anfrage-Formular */}
      <div id="anfrage" className="mt-14 scroll-mt-28">
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-[#2f2b25] p-6 sm:p-8">
          <h2 className="font-serif text-3xl text-gold">{d.formTitle}</h2>
          <p className="mt-2 text-sm text-muted">{d.note}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm text-muted">{d.serviceLabel}</p>
              <div className="flex flex-wrap gap-2">
                {d.items.map((item) => (
                  <button
                    key={item.h}
                    type="button"
                    onClick={() => setService(item.h)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      service === item.h
                        ? "border-gold bg-gold text-paper"
                        : "border-line text-ink hover:border-gold"
                    }`}
                  >
                    {item.h}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm text-muted">{d.dateLabel}</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder={f.firstName}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputCls}
              />
              <input
                required
                placeholder={f.lastName}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                type="email"
                placeholder={f.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
              <input
                placeholder={f.phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder={f.message}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputCls}
            />

            {state === "ok" ? <p className="text-sm text-green-400">{f.success}</p> : null}
            {state === "error" ? <p className="text-sm text-red-400">{f.error}</p> : null}

            <button
              type="submit"
              disabled={state === "sending" || !service}
              className="w-full rounded-full bg-gold px-6 py-3 font-medium text-paper transition hover:brightness-105 disabled:opacity-60"
            >
              {state === "sending" ? f.sending : f.send}
            </button>
            {!service ? <p className="text-center text-xs text-muted">{d.serviceLabel}?</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
