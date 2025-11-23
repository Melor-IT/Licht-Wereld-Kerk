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
      totalOfadults = 0,
      kidsgirls6 = 0,
      kidsgirls12 = 0,
      kidsboys6 = 0,
      kidsboys12 = 0,
      message = "",
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total people
    const totalPeople =
      Number(totalOfadults) +
      Number(kidsgirls6) +
      Number(kidsgirls12) +
      Number(kidsboys6) +
      Number(kidsboys12);

    // Configure mail transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email for admin / third person
    await transporter.sendMail({
      from: `"Kerst Evenement" <${process.env.EMAIL_USER}>`,
      to: process.env.THIRD_PERSON_EMAIL,
      subject: "🎄 Nieuwe Kerstregistratie",
      html: `
        <h2 style="color:#c62828;">🎄 Nieuwe kerstregistratie</h2>
        <p><b>Naam:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefoon:</b> ${phone}</p>
        <p><b>Aantal volwassenen:</b> ${totalOfadults}</p>
        <p><b>Meisjes t/m 6:</b> ${kidsgirls6}</p>
        <p><b>Meisjes t/m 12:</b> ${kidsgirls12}</p>
        <p><b>Jongens t/m 6:</b> ${kidsboys6}</p>
        <p><b>Jongens t/m 12:</b> ${kidsboys12}</p>
        <p><b>Totaal aantal personen:</b> <strong>${totalPeople}</strong></p>
        <p><b>Bericht:</b><br/> ${message}</p>
      `,
    });

    // Confirmation email to the user
    await transporter.sendMail({
      from: `"Kerst Evenement" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎄 Uw registratie is ontvangen!",
      html: `
        <p>Hallo ${firstName},</p>
        <p>Bedankt voor uw registratie voor ons kerstevenement!</p>

        <p><b>Totaal aantal personen:</b> ${totalPeople}</p>

        <p>We kijken ernaar uit u te zien!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis op de server." },
      { status: 500 }
    );
  }
}
