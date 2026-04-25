import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, address } = body;

    if (!name || !phone || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'popup_leads'), {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      offer: '2ml Free Mystery Attar',
      claimedAt: serverTimestamp(),
      source: 'homepage_popup',
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('Popup lead save error:', err);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
