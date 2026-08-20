"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import type { Availability, ServiceItem } from "@/lib/store";

// Zeit-Slots aus dem Verfügbarkeits-Fenster bauen (z.B. 09:00, 10:00, ...).
function buildSlots(av: Availability): string[] {
  const [fh, fm] = av.from.split(":").map(Number);
  const [th, tm] = av.to.split(":").map(Number);
  let m = fh * 60 + fm;
  const end = th * 60 + tm;
  const out: string[] = [];
  while (m + av.slotMinutes <= end) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    m += av.slotMinutes;
  }
  return out;
}

// Dienstleistungen + Buchungs-Anfrage. Angebote und Verfügbarkeit kommen aus dem
// Dashboard-CMS (Store), die Anfrage geht per Mail an den Website-Besitzer.
export default function ServiceBooking({
  lang,
  services,
  availability,
}: {
  lang: Lang;
  services: ServiceItem[];
  availability: Availability;
}) {
  const d = t(lang).services;
  const f = t(lang).about.form;
  const slots = buildSlots(availability);
  const dayHint = [1, 2, 3, 4, 5, 6, 0]
    .filter((n) => availability.days.includes(n))
    .map((n) => d.dayNames[n])
    .join(", ");

  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  function pick(title: string) {
    setService(title);
    setState("idle");
    document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pickDate(value: string) {
    setDate(value);
    if (!value) {
      setDateError(false);
      return;
    }
    const day = new Date(`${value}T12:00:00`).getDay();
    setDateError(!availability.days.includes(day));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (dateError) return;
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, message, service, date, time }),
    }).catch(() => null);
    if (res?.ok) {
      setState("ok");
      setDate("");
      setTime(null);
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
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      {/* Angebots-Karten aus dem CMS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col rounded-2xl border bg-[#312d27] p-6 transition ${
              service === item.title ? "border-gold" : "border-line hover:border-gold/50"
            }`}
          >
            <h2 className="font-serif text-2xl text-gold">{item.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.desc}</p>
            {item.price ? <p className="mt-3 text-sm font-medium text-gold">{item.price}</p> : null}
            <button
              onClick={() => pick(item.title)}
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
                {services.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setService(item.title)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      service === item.title
                        ? "border-gold bg-gold text-paper"
                        : "border-line text-ink hover:border-gold"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm text-muted">
                {d.dateLabel} · {d.availableLabel}: {dayHint}
              </span>
              <input
                required
                type="date"
                min={today}
                value={date}
                onChange={(e) => pickDate(e.target.value)}
                className={inputCls}
              />
              {dateError ? <span className="mt-1 block text-sm text-red-400">{d.invalidDay}</span> : null}
            </label>

            <div>
              <p className="mb-2 text-sm text-muted">{d.timeLabel}</p>
              <div className="flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      time === s
                        ? "border-gold bg-gold text-paper"
                        : "border-line text-ink hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

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
              disabled={state === "sending" || !service || !time || dateError}
              className="w-full rounded-full bg-gold px-6 py-3 font-medium text-paper transition hover:brightness-105 disabled:opacity-60"
            >
              {state === "sending" ? f.sending : f.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
