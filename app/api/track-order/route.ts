import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { orderId, contact } = await req.json();

    if (!orderId || !contact) {
      return NextResponse.json({ error: 'Order ID and Contact info are required.' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database is not initialized on the server.' }, { status: 500 });
    }

    // Query Firestore securely from the server (bypasses security rules)
    const snapshot = await adminDb
      .collection('orders')
      .where('orderId', '==', orderId.replace(/^#/, '').trim().toUpperCase())
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'No order found with this Order ID. Please check and try again.' }, { status: 404 });
    }

    let matchedOrder: any = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const customerPhone = data.customerInfo?.phone || '';
      const customerEmail = (data.customerInfo?.email || '').toLowerCase();
      const inputContact = contact.trim().toLowerCase();

      // Match by phone (last 10 digits) or email
      const phoneDigits = customerPhone.replace(/\D/g, '').slice(-10);
      const inputDigits = inputContact.replace(/\D/g, '').slice(-10);

      if (
        (inputDigits.length >= 10 && phoneDigits === inputDigits) ||
        (inputContact.includes('@') && customerEmail === inputContact)
      ) {
        matchedOrder = {
          id: doc.id,
          orderId: data.orderId,
          customerInfo: data.customerInfo,
          shippingAddress: data.shippingAddress,
          items: data.items || [],
          totalPrice: data.totalPrice || 0,
          shippingFee: data.shippingFee || 0,
          finalTotal: data.finalTotal || 0,
          paymentMethod: data.paymentMethod || 'COD',
          status: data.status || 'Pending',
          // Convert Timestamp to string or number for JSON serialization
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        };
      }
    });

    if (matchedOrder) {
      return NextResponse.json({ order: matchedOrder }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Order found, but the phone number or email does not match our records.' }, { status: 403 });
    }
  } catch (error) {
    console.error('Track Order API Error:', error);
    return NextResponse.json({ error: 'Something went wrong while tracking your order.' }, { status: 500 });
  }
}
