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

    // ساختار transporter برای Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ارسال ایمیل
    await transporter.sendMail({
      from: `"Christmas Event" <${process.env.EMAIL_USER}>`,
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
