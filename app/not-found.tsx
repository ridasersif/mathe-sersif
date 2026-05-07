import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 16, fontFamily: 'Playfair Display, serif', fontWeight: 700, background: 'linear-gradient(135deg, #4f8ef7, #7c5cbf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 12, fontFamily: 'Playfair Display, serif' }}>Page introuvable</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link href="/" className="btn btn-primary btn-lg">← Retour à l'accueil</Link>
      </div>
    </div>
  );
}
