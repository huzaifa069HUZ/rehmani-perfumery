import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerInfo, shippingAddress, items, finalTotal, shippingFee, paymentMethod } = body;

    // Validate required fields
    if (!orderId || !customerInfo || !shippingAddress || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ─── 1. Customer Email HTML ───
    const customerHtml = `
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F172A; background-color: #ffffff; padding: 0;">
        
        <!-- Header -->
        <div style="text-align: center; padding: 40px 20px; background-color: #fbfbf9; border-bottom: 1px solid #e2e8f0;">
          <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #0F172A;">RAHMANI PERFUMERY</h1>
          <p style="margin: 8px 0 0; font-size: 14px; color: #64748b; letter-spacing: 1px;">PREMIUM FRAGRANCES</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 14px; font-weight: 600; color: #E11D48; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase;">Order Confirmed</p>
          <h2 style="margin: 0 0 24px; font-size: 24px; font-weight: 700;">Thank you, ${customerInfo.name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 30px;">
            We have received your order <strong>#${orderId}</strong> and are preparing it for shipment. 
          </p>

          ${paymentMethod === 'COD' ? `
          <div style="background-color: #FEF2F2; border-left: 4px solid #E11D48; padding: 16px 20px; margin-bottom: 30px; border-radius: 4px;">
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #991B1B;">⚠️ Cash on Delivery (COD) Notice</p>
            <p style="margin: 0; font-size: 14px; color: #991B1B; line-height: 1.5;">Our team will contact you on WhatsApp shortly to confirm this order. Your order will be dispatched upon confirmation.</p>
          </div>
          ` : ''}

          <!-- Order Summary -->
          <h3 style="font-size: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${items.map((item: any) => `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                  <p style="margin: 0; font-weight: 600; font-size: 15px;">${item.name}</p>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">${item.size === 1 ? '1 Box' : `${item.size}ml`} &times; ${item.quantity}</p>
                </td>
                <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9; font-weight: 600; font-size: 15px;">
                  ${item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}
                </td>
              </tr>
            `).join('')}
          </table>

          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 15px; color: #475569;">
            <span>Subtotal</span>
            <span>₹${finalTotal - shippingFee}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 15px; color: #475569; border-bottom: 1px solid #e2e8f0;">
            <span>Shipping</span>
            <span>${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 20px 0 0; font-size: 18px; font-weight: 700; color: #0F172A;">
            <span>Total</span>
            <span>₹${finalTotal}</span>
          </div>

          <!-- Shipping Address -->
          <h3 style="font-size: 18px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin: 40px 0 20px;">Shipping Details</h3>
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
            <strong>${customerInfo.name}</strong><br>
            ${shippingAddress.house}, ${shippingAddress.area}<br>
            ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br>
            Phone: ${customerInfo.phone}
          </p>

        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #64748b;">Need help? Reply to this email or contact us.</p>
          <p style="margin: 0 0 20px; font-size: 14px; font-weight: 600; color: #0F172A;">WhatsApp/Call: +91 93082 12104</p>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Rahmani Perfumery. All rights reserved.</p>
        </div>
      </div>
    `;

    // ─── 2. Admin Email HTML (For Fulfillment) ───
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1E40AF; border-bottom: 2px solid #DBEAFE; padding-bottom: 10px;">NEW ORDER: #${orderId}</h2>
        <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        <p><strong>Amount:</strong> ₹${finalTotal} (${paymentMethod})</p>

        <h3 style="background: #f1f5f9; padding: 8px; margin-top: 20px;">CUSTOMER INFO</h3>
        <p><strong>Name:</strong> ${customerInfo.name}</p>
        <p><strong>Phone:</strong> <a href="https://wa.me/91${customerInfo.phone}">${customerInfo.phone}</a></p>
        <p><strong>Email:</strong> ${customerInfo.email || 'N/A'}</p>

        <h3 style="background: #f1f5f9; padding: 8px; margin-top: 20px;">SHIPPING ADDRESS</h3>
        <p>${shippingAddress.house}, ${shippingAddress.area}</p>
        <p>${shippingAddress.city}, ${shippingAddress.state}</p>
        <p><strong>PIN:</strong> ${shippingAddress.pincode}</p>

        <h3 style="background: #f1f5f9; padding: 8px; margin-top: 20px;">ITEMS ORDERED</h3>
        <table style="width: 100%; border-collapse: collapse;" border="1" cellpadding="8">
          <tr style="background: #e2e8f0;">
            <th>Product</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
          ${items.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.size === 1 ? '1 Box' : `${item.size}ml`}</td>
              <td><strong>${item.quantity}</strong></td>
              <td>${item.price === 0 ? 'FREE' : `₹${item.price * item.quantity}`}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;

    // ─── Send Emails in Parallel ───
    const customerMailOptions = {
      from: '"Rahmani Perfumery" <' + process.env.EMAIL_USER + '>',
      to: customerInfo.email,
      subject: `Order Confirmed: #${orderId}`,
      html: customerHtml,
    };

    const adminMailOptions = {
      from: '"Rahmani Store System" <' + process.env.EMAIL_USER + '>',
      to: ['rahmaniperfumery@gmail.com', 'rahmaniperfumerypatna@gmail.com'],
      subject: `🚨 NEW ORDER: #${orderId} - ₹${finalTotal}`,
      html: adminHtml,
    };

    // We use Promise.allSettled so that if customer email is missing/invalid, admin email still sends.
    const results = await Promise.allSettled([
      customerInfo.email ? transporter.sendMail(customerMailOptions) : Promise.resolve('No customer email'),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log("Email dispatch results:", results);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error sending order emails:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
