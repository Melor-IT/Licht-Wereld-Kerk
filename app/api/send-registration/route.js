export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      totalOfadults,
      kidsgirls6,
      kidsgirls12,
      kidsboys6,
      kidsboys12,
      message,
    } = body;

    // محاسبه جمع کل افراد
    const totalPeople =
      Number(totalOfadults || 0) +
      Number(kidsgirls6 || 0) +
      Number(kidsgirls12 || 0) +
      Number(kidsboys6 || 0) +
      Number(kidsboys12 || 0);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ایمیل برای شما و شخص سوم
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
        <p><b>Meisjes-6:</b> ${kidsgirls6}</p>
        <p><b>Meisjes-12:</b> ${kidsgirls12}</p>
        <p><b>Jongens-6:</b> ${kidsboys6}</p>
        <p><b>Jongens-12:</b> ${kidsboys12}</p>
        <p><b>TOTAAL AANTAL PERSONEN:</b> <span style="font-size:18px; color:#2e7d32;">${totalPeople}</span></p>
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
        <p><b>Totaal aantal personen:</b> ${totalPeople}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
