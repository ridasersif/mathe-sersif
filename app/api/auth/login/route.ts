import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const supabase = await createClient();

    // Try to login assuming the username is the email
    // Or if they typed the username, we can't easily look up the email without a service key, 
    // but they can type their email directly as the label suggests.
    const email = username.includes('@') ? username : 'rachidsersif@gmial.com'; // Fallback to admin email if they type username

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur de connexion au serveur' }, { status: 500 });
  }
}
