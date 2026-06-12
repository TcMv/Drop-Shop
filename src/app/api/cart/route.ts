import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cart (per-request — in production use sessions/cookies)
// We'll use localStorage on the frontend, but this provides server-side support

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, title, price, image, quantity = 1 } = body;
    
    if (!productId || !title || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      item: { productId, title, price, quantity, image },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
