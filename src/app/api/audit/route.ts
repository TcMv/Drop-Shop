import { NextRequest, NextResponse } from 'next/server';
import { getAuditLog } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  const result = await getAuditLog(Math.min(limit, 200), Math.max(offset, 0));
  return NextResponse.json(result);
}
