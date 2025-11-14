import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      totalOfadults,
      kidsgirls,
      kidsboys,
      message,
    } = body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ایمیل به شما و شخص سوم
    await transporter.sendMail({
      from: `"Kerst Evenement" <${process.env.EMAIL_USER}>`,
      to: [process.env.THIRD_PERSON_EMAIL], 
      subject: "🎄 Nieuw Kerstregistratieformulier",
      html: `
        <h2 style="color:#c62828;">🎄 Nieuwe kerstregistratie</h2>
        <p><b>Naam:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefoon:</b> ${phone}</p>
        <p><b>Aantal volwassenen:</b> ${totalOfadults}</p>
        <p><b>Meisjes:</b> ${kidsgirls}</p>
        <p><b>Jongens:</b> ${kidsboys}</p>
        <p><b>Bericht:</b> ${message}</p>
      `,
    });

    // ایمیل تاییدیه به کاربر
    await transporter.sendMail({
      from: `"Kerst Evenement" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎄 Registratie ontvangen",
      html: `
        <p>Hallo ${firstName},</p>
        <p>Bedankt voor uw registratie voor ons kerst evenement! We hebben uw registratie succesvol ontvangen.</p>
        <p>We kijken ernaar uit u te zien!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
