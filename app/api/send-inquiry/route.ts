import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, phone, message } = await req.json();

    if (!name || !phone || !message) {
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
      from: `"Rahmani Perfumery Website" <${process.env.EMAIL_USER}>`,
      to: [process.env.EMAIL_USER, 'rahmaniperfumery@gmail.com'].join(','), // Send to both emails
      subject: `New Website Inquiry from ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">Rahmani Perfumery</h1>
            <p style="color: #888; font-size: 14px; margin-top: 5px;">New Customer Inquiry</p>
          </div>
          <div style="background-color: #fafafa; padding: 25px; border-radius: 12px; border: 1px solid #eaeaea;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 120px;"><strong><span style="color: #666;">Name:</span></strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong><span style="color: #666;">Phone:</span></strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 500;">
                  <a href="tel:${phone}" style="color: #d4af37; text-decoration: none;">${phone}</a>
                </td>
              </tr>
            </table>
            
            <div style="margin-top: 25px;">
              <strong style="color: #666; display: block; margin-bottom: 10px;">Message:</strong>
              <div style="background-color: #fff; padding: 20px; border-left: 4px solid #d4af37; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); font-size: 15px; color: #444;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
            <p>This email was sent automatically from your website's contact form.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error: any) {
    console.error('Error sending inquiry:', error);
    return NextResponse.json({ error: error.message || 'Failed to send inquiry' }, { status: 500 });
  }
}
