import { NextRequest, NextResponse } from 'next/server';
import { post, get } from '@/lib/db';

interface HackersClubRow {
  id: string;
  email: string;
  source: string;
  member_number: number;
  discount_code: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existing } = await get<HackersClubRow>('hackers_club', {
      email: `eq.${trimmedEmail}`,
      select: 'id,member_number',
      limit: '1',
    });

    if (existing && existing.length > 0) {
      return NextResponse.json({
        success: true,
        member_number: existing[0].member_number,
        discount_code: 'HACKERS10',
        message: 'Already a member',
      });
    }

    // Get the highest member_number to auto-increment
    const { data: maxRow } = await get<{ member_number: number }>('hackers_club', {
      select: 'member_number',
      order: 'member_number.desc',
      limit: '1',
    });

    const nextNumber = (maxRow && maxRow.length > 0 ? maxRow[0].member_number : 0) + 1;

    // Insert the new member
    const { error } = await post<HackersClubRow>(
      'hackers_club',
      {
        email: trimmedEmail,
        source: source || 'homepage',
        member_number: nextNumber,
        discount_code: 'HACKERS10',
      },
      { Prefer: 'return=representation' }
    );

    if (error) {
      // Handle duplicate email (unique constraint violation)
      if (error.message?.includes('23505') || error.message?.includes('duplicate')) {
        return NextResponse.json({
          success: true,
          member_number: nextNumber,
          discount_code: 'HACKERS10',
          message: 'Already a member',
        });
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message || 'Failed to join' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      member_number: nextNumber,
      discount_code: 'HACKERS10',
    });
  } catch (err: any) {
    console.error('Hackers Club API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { count, data, error } = await get<{ id: string }>('hackers_club', {
      select: 'id',
    });

    if (error) {
      console.error('Supabase count error:', error);
      return NextResponse.json({ error: error.message || 'Failed to get count' }, { status: 500 });
    }

    // Use the content-range count if available, otherwise count the returned rows
    const totalCount = count !== null ? count : (data ? data.length : 0);

    return NextResponse.json({ count: totalCount });
  } catch (err: any) {
    console.error('Hackers Club GET error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
