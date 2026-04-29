import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { subject, message, emails } = await req.json();

    if (!subject || !message || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rahmani Perfumery" <${process.env.EMAIL_USER}>`,
      bcc: emails, // Using BCC so recipients don't see each other's emails
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0;">Rahmani Perfumery</h1>
          </div>
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
            <p>You are receiving this email because you subscribed to Rahmani Perfumery.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Emails sent successfully!' });
  } catch (error: any) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send emails' }, { status: 500 });
  }
}
