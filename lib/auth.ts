'use server';

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'math_session';
const API_BASE = 'http://localhost:3001';

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Identifiants invalides' };
    }

    const data = await res.json();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ authenticated: boolean; username?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE);

  if (!token?.value) {
    return { authenticated: false };
  }

  try {
    const decoded = Buffer.from(token.value, 'base64').toString('utf-8');
    const [username] = decoded.split(':');
    return { authenticated: true, username };
  } catch {
    return { authenticated: false };
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.authenticated;
}
