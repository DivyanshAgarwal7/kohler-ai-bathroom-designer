import { NextResponse } from 'next/server';
import { interpretBathroomRequest } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      !('text' in body) ||
      typeof body.text !== 'string' ||
      body.text.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'A non-empty "text" field is required.',
        },
        { status: 400 }
      );
    }

    const requirements = await interpretBathroomRequest(body.text);

    return NextResponse.json({
      success: true,
      requirements,
    });
  }  catch (error) {
  console.error('Gemini interpretation error:', error);

  const message =
    error instanceof Error ? error.message : '';

  const isTimeout =
    message.includes('DEADLINE_EXCEEDED') ||
    message.includes('UND_ERR_HEADERS_TIMEOUT') ||
    message.toLowerCase().includes('timeout');

  const isUnavailable =
    message.includes('"status":"UNAVAILABLE"') ||
    message.includes('503');

  return NextResponse.json(
    {
      success: false,
      error: isTimeout
        ? 'AI interpretation timed out. Please try again.'
        : isUnavailable
          ? 'The AI service is temporarily busy. Please try again.'
          : 'Unable to interpret your requirements right now.',
    },
    { status: 503 }
  );
}
}