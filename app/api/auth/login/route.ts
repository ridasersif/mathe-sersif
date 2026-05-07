import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const res = await fetch('http://localhost:3002/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.error || 'Identifiants invalides' }, { status: 401 });
    }

    const data = await res.json();
    const response = NextResponse.json({ success: true });
    response.cookies.set('math_session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Erreur de connexion au serveur' }, { status: 500 });
  }
}
