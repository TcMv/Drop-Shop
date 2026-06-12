import { NextResponse } from 'next/server';
import { runSourcing } from '@/lib/agents/sourcing';

export async function POST() {
  try {
    const result = await runSourcing();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
