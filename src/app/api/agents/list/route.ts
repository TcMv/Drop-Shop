import { NextResponse } from 'next/server';
import { runListing } from '@/lib/agents/listing';

export async function POST() {
  try {
    const result = await runListing();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
