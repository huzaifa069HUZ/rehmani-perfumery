import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure once at module level — not per-request
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(request: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Cloudinary credentials missing from environment variables' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'perfumery';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum allowed is ${MAX_FILE_SIZE / 1024 / 1024} MB.` },
        { status: 413 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise<NextResponse>((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            // ✅ NO eager transforms — URL-based transforms are zero-latency on delivery
            // ✅ Cloudinary auto-optimises quality & format on the CDN edge
            quality: 'auto',
            fetch_format: 'auto',
            // Strip EXIF/GPS metadata
            use_filename: false,
            unique_filename: true,
          },
          (error, result) => {
            if (error || !result) {
              console.error('Cloudinary upload error:', error);
              resolve(
                NextResponse.json(
                  { error: error?.message ?? 'Upload failed' },
                  { status: 500 }
                )
              );
            } else {
              resolve(
                NextResponse.json(
                  {
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                  },
                  { status: 200 }
                )
              );
            }
          }
        )
        .end(buffer);
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Server error during upload';
    console.error('API Upload error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
