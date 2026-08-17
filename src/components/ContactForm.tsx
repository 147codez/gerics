"use client";

import { useState } from "react";

type FormLabels = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
};

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", message: "" };

export default function ContactForm({ form }: { form: FormLabels }) {
  const [values, setValues] = useState(EMPTY);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  function set(key: keyof typeof EMPTY, v: string) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setValues(EMPTY);
      setState("ok");
    } else {
      setState("error");
    }
  }

  if (state === "ok") {
    return <p className="mt-6 text-lg text-gold">{form.success}</p>;
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-gold";

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder={form.firstName}
          required
          value={values.firstName}
          onChange={(e) => set("firstName", e.target.value)}
        />
        <input
          className={inputClass}
          placeholder={form.lastName}
          required
          value={values.lastName}
          onChange={(e) => set("lastName", e.target.value)}
        />
        <input
          className={inputClass}
          type="email"
          placeholder={form.email}
          required
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <input
          className={inputClass}
          type="tel"
          placeholder={form.phone}
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </div>
      <textarea
        className={`${inputClass} min-h-[140px] resize-y`}
        placeholder={form.message}
        required
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
      />
      {state === "error" ? <p className="text-sm text-red-400">{form.error}</p> : null}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-gold px-7 py-3 font-medium text-paper transition hover:brightness-105 disabled:opacity-60"
      >
        {state === "sending" ? form.sending : form.send}
      </button>
    </form>
  );
}
