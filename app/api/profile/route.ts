import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/profile — returns the single profile row, no auth needed (public read)
export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin.from('profiles').select('*').limit(1).single();
  if (error || !data) {
    return NextResponse.json({ error: 'Profile introuvable' }, { status: 404 });
  }
  return NextResponse.json({ profile: data });
}
