import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  // Keep the old math_session clear just in case to avoid any legacy bugs
  const response = NextResponse.json({ success: true });
  response.cookies.set('math_session', '', { maxAge: 0, path: '/' });
  return response;
}
