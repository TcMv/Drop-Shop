export async function GET() {
  return Response.json({
    status: "ok",
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    },
    timestamp: new Date().toISOString(),
  });
}
