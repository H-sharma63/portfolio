
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    // Generate a unique filename to prevent collisions
    const filename = `resumes/${uuidv4()}.pdf`;

    // Upload the file to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass the token
    });

    // Update Neon DB with the new resume URL
    const client = await pool.connect();

    const existingContentResult = await client.query(
      'SELECT value FROM config WHERE key = $1',
      ['connect']
    );
    let existingConnectContent = {};
    if (existingContentResult.rows.length > 0) {
      existingConnectContent = existingContentResult.rows[0].value;
    }

    const updatedConnectContent = {
      ...existingConnectContent,
      resumeUrl: blob.url,
    };

    await client.query(
      'INSERT INTO config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
      ['connect', JSON.stringify(updatedConnectContent)]
    );
    client.release();

    return NextResponse.json({ message: 'Upload successful!', url: blob.url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading resume:', error);
    // Return a more detailed error message for debugging
    return NextResponse.json({ message: 'Failed to upload resume.', error: (error as Error).message, details: JSON.stringify(error) }, { status: 500 });
  }
}
