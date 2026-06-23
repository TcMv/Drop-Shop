import { NextRequest, NextResponse } from 'next/server';

function getApiBase(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url.replace(/\/$/, "") + "/rest/v1";
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      apikey: getAnonKey(),
      Authorization: `Bearer ${getAnonKey()}`,
      "Content-Type": "application/json",
    };

    // Insert new member — Supabase unique constraint handles duplicates
    const res = await fetch(`${getApiBase()}/hackers_club`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({
        email: trimmedEmail,
        source: 'homepage',
        discount_code: 'HACKERS10',
      }),
    });

    if (res.status === 409) {
      // Duplicate email — member already exists
      return NextResponse.json({
        success: true,
        discount_code: 'HACKERS10',
        message: 'Already a member',
      });
    }

    if (!res.ok) {
      const text = await res.text();
      console.error('Supabase insert error:', res.status, text);
      return NextResponse.json({ error: 'Failed to join club' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      discount_code: 'HACKERS10',
    });
  } catch (err: any) {
    console.error('Hackers Club API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const headers: Record<string, string> = {
      apikey: getAnonKey(),
      Authorization: `Bearer ${getAnonKey()}`,
    };

    const res = await fetch(`${getApiBase()}/hackers_club?select=id`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      return NextResponse.json({ count: 0 });
    }

    const data = await res.json();
    return NextResponse.json({ count: Array.isArray(data) ? data.length : 0 });
  } catch (err: any) {
    console.error('Hackers Club GET error:', err);
    return NextResponse.json({ count: 0 });
  }
}
