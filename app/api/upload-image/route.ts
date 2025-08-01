import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (error, uploadResult) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(uploadResult as CloudinaryUploadResult);
      }).end(buffer);
    });

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}