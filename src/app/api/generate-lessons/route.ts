// app/api/generate-lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lesson_list } = body;

    if (!lesson_list) {
      return NextResponse.json(
        { error: 'Missing lesson_list' },
        { status: 400 }
      );
    }

    // Call Flask backend
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lesson_list }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Lesson generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lessons' },
      { status: 500 }
    );
  }
}