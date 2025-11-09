import { NextResponse } from "next/server";
import { Resend } from "resend";

console.log("✅ Loaded RESEND_API_KEY:", process.env.RESEND_API_KEY ? "YES" : "NO");
console.log("✅ Loaded MY_EMAIL:", process.env.MY_EMAIL || "NOT SET");


if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in environment variables!");
}

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
      subject: "🎄 Nieuw Kerstregistratieformulier",
      html: `
        <h2 style="color:#c62828;">🎄 New Christmas Registration</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Total adults:</b> ${totalOfadults}</p>
        <p><b>Girls:</b> ${kidsgirls}</p>
        <p><b>Boys:</b> ${kidsboys}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}