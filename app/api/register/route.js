import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req) {
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

  try {
    await resend.emails.send({
      from: "Christmas Event <onboarding@resend.dev>",
      to: process.env.MY_EMAIL,
      subject: "🎄 New Christmas Registration Form",
      html: `
        <h2 style="color:#c62828;">🎄 New Christmas Registration</h2>
        <p><b>Naam:</b> ${firstName} ${lastName}</p>
        <p><b>E-mail:</b> ${email}</p>
        <p><b>Telefoon:</b> ${phone}</p>
        <p><b>Totaal aantal volwassenen:</b> ${totalOfadults}</p>
        <p><b>Aantal meisjes:</b> ${kidsgirls}</p>
        <p><b>Aantal jongens:</b> ${kidsboys}</p>
        <p><b>Bericht:</b> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
