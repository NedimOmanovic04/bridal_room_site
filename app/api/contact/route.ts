export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ ok: false, error: 'Nedostaju obavezna polja' }, { status: 400 });
  }

  const salonEmail = process.env.SALON_EMAIL;
  if (!salonEmail) {
    return NextResponse.json({ ok: false, error: 'SALON_EMAIL nije postavljen' }, { status: 500 });
  }

  const { error } = await resend.emails.send({
    from: 'The Bridal Room <onboarding@resend.dev>',
    to: salonEmail,
    replyTo: email,
    subject: `Nova rezervacija — ${name}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;padding:40px 24px;background:#FDFAF5;color:#3A2A1A;">
        <div style="border-bottom:2px solid #C9A96E;padding-bottom:20px;margin-bottom:28px;">
          <h1 style="margin:0;font-size:26px;font-style:italic;color:#5C4033;font-weight:400;">The Bridal Room</h1>
          <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8A7060;">Nova rezervacija probanja</p>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E8D5B0;width:130px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8A7060;vertical-align:top;">Ime i prezime</td>
            <td style="padding:12px 0;border-bottom:1px solid #E8D5B0;font-size:15px;">${name}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E8D5B0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8A7060;vertical-align:top;">Email</td>
            <td style="padding:12px 0;border-bottom:1px solid #E8D5B0;font-size:15px;">
              <a href="mailto:${email}" style="color:#C9A96E;text-decoration:none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8A7060;vertical-align:top;">Poruka</td>
            <td style="padding:12px 0;font-size:15px;line-height:1.7;">${message.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>

        <p style="margin-top:32px;padding-top:16px;border-top:1px solid #E8D5B0;font-size:11px;color:#8A7060;letter-spacing:0.1em;">
          TC Vizija, ul. Alije Izetbegovića, Visoko
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Resend greška:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
