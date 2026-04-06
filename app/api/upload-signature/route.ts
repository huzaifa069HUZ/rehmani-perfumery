import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Returns a short-lived Cloudinary upload signature so the browser
// can upload directly to Cloudinary without proxying through this server.
export async function GET() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: 'Cloudinary credentials missing' },
      { status: 500 }
    );
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'perfumery';

    const paramsToSign = { folder, timestamp };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (err: any) {
    console.error("Cloudinary sign error:", err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
