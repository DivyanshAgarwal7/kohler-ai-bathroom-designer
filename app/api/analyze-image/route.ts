import { NextResponse } from 'next/server';
import { analyzeBathroomImage } from '@/lib/ai/gemini';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get('image');
    const context = formData.get('context');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please upload an image.',
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supported image formats are JPG, PNG, and WebP.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image must be 10 MB or smaller.',
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageBase64 = buffer.toString('base64');

    const analysis = await analyzeBathroomImage(
      imageBase64,
      file.type,
      typeof context === 'string' ? context : undefined
    );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Bathroom image analysis error:', error);

    const message =
      error instanceof Error ? error.message : '';

    const isTimeout =
      message.includes('DEADLINE_EXCEEDED') ||
      message.includes('UND_ERR_HEADERS_TIMEOUT') ||
      message.toLowerCase().includes('timeout');

    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? 'Image analysis timed out. Please try again.'
          : 'Unable to analyze the bathroom image right now.',
      },
      { status: 503 }
    );
  }
}