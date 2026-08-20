import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SITE_EMAIL } from "@/lib/site";

export const runtime = "nodejs";

const SMTP_USER = process.env.SMTP_USER; // z.B. info@gerics.ch
const SMTP_PASS = process.env.SMTP_PASS; // Postfach-Kennwort

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  // Optional: Buchungsanfrage von /dienstleistungen
  const service = String(body.service || "").trim();
  const date = String(body.date || "").trim();
  const time = String(body.time || "").trim();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail" }, { status: 400 });
  }
  if (!SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ error: "Mailversand nicht konfiguriert" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: "mail.infomaniak.com",
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const text = [
    service ? "Neue Buchungsanfrage über gerics.ch" : "Neue Kontaktanfrage über gerics.ch",
    "",
    ...(service
      ? [`Dienstleistung: ${service}`, `Wunschtermin: ${date ? `${date}${time ? ` ${time}` : ""}` : "-"}`]
      : []),
    `Vorname: ${firstName}`,
    `Name: ${lastName}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone || "-"}`,
    "",
    "Anliegen:",
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"Gerics Kontaktformular" <${SMTP_USER}>`,
      to: SITE_EMAIL,
      replyTo: email,
      subject: service
        ? `Buchungsanfrage ${service} von ${firstName} ${lastName}`
        : `Kontaktanfrage von ${firstName} ${lastName}`,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Versand fehlgeschlagen" }, { status: 500 });
  }
}
