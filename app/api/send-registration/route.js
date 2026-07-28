import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAX_TEXT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_ATTENDEES_PER_GROUP = 100;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, maxLength = MAX_TEXT_LENGTH) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength
    ? value.trim()
    : null;
}

function attendeeCount(value) {
  const count = typeof value === "number" || typeof value === "string" ? Number(value) : NaN;
  return Number.isSafeInteger(count) && count >= 0 && count <= MAX_ATTENDEES_PER_GROUP
    ? count
    : null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const firstName = text(body.firstName);
    const lastName = text(body.lastName);
    const email = text(body.email);
    const phone = body.phone == null || body.phone === "" ? "" : text(body.phone);
    const message = body.message == null || body.message === "" ? "" : text(body.message, MAX_MESSAGE_LENGTH);
    const counts = [
      attendeeCount(body.totalOfadults ?? 0),
      attendeeCount(body.kidsgirls6 ?? 0),
      attendeeCount(body.kidsgirls12 ?? 0),
      attendeeCount(body.kidsboys6 ?? 0),
      attendeeCount(body.kidsboys12 ?? 0),
    ];

    if (!firstName || !lastName || !email || !emailPattern.test(email) || phone === null || message === null || counts.includes(null)) {
      return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
    }

    const [totalOfadults, kidsgirls6, kidsgirls12, kidsboys6, kidsboys12] = counts;
    const totalPeople = totalOfadults + kidsgirls6 + kidsgirls12 + kidsboys6 + kidsboys12;

    const { EMAIL_USER, EMAIL_PASS, THIRD_PERSON_EMAIL } = process.env;
    if (!EMAIL_USER || !EMAIL_PASS || !THIRD_PERSON_EMAIL) {
      console.error("Email service is not configured");
      return NextResponse.json({ error: "Email service is unavailable" }, { status: 503 });
    }

    const safe = {
      firstName: escapeHtml(firstName),
      lastName: escapeHtml(lastName),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      message: escapeHtml(message),
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Kerst Evenement" <${EMAIL_USER}>`,
      to: THIRD_PERSON_EMAIL,
      subject: "🎄 Nieuwe Kerstregistratie",
      html: `
        <h2 style="color:#c62828;">🎄 Nieuwe kerstregistratie</h2>
        <p><b>Naam:</b> ${safe.firstName} ${safe.lastName}</p>
        <p><b>Email:</b> ${safe.email}</p>
        <p><b>Telefoon:</b> ${safe.phone}</p>
        <p><b>Aantal volwassenen:</b> ${totalOfadults}</p>
        <p><b>Meisjes t/m 6:</b> ${kidsgirls6}</p>
        <p><b>Meisjes t/m 12:</b> ${kidsgirls12}</p>
        <p><b>Jongens t/m 6:</b> ${kidsboys6}</p>
        <p><b>Jongens t/m 12:</b> ${kidsboys12}</p>
        <p><b>Totaal aantal personen:</b> <strong>${totalPeople}</strong></p>
        <p><b>Bericht:</b><br/>${safe.message}</p>
      `,
    });

    await transporter.sendMail({
      from: `"Kerst Evenement" <${EMAIL_USER}>`,
      to: email,
      subject: "🎄 Uw registratie is ontvangen!",
      html: `
        <p>Hallo ${safe.firstName},</p>
        <p>Bedankt voor uw registratie voor ons kerstevenement!</p>
        <p><b>Totaal aantal personen:</b> ${totalPeople}</p>
        <p>We kijken ernaar uit u te zien!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Er ging iets mis op de server." }, { status: 500 });
  }
}
