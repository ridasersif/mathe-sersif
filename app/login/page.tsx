'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fd.get('username'), password: fd.get('password') }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Identifiants invalides'); return; }
      router.push(from);
      router.refresh();
    } catch {
      setError('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="navbar-logo-icon" style={{ width: 56, height: 56, fontSize: '1.6rem', margin: '0 auto 16px' }}>∑</div>
          <h1 className="title-md">Espace Administrateur</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 6 }}>
            Accès réservé au professeur
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Identifiant</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Votre identifiant"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
            {loading ? 'Connexion en cours…' : '🔐 Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Cette page n'est pas accessible depuis le menu principal.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
