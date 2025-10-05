// app/api/create-plan/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topics, minutes_per_lesson } = body;

    if (!topics || !minutes_per_lesson) {
      return NextResponse.json(
        { error: 'Missing topics or minutes_per_lesson' },
        { status: 400 }
      );
    }

    // Forward to Flask backend
    const response = await fetch('http://localhost:8000/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topics,
        minutes_per_lesson,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Plan creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson plan' },
      { status: 500 }
    );
  }
}