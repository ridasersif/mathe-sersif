import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>∑</div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem' }}>Prof. Benali</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 300 }}>
              Professeur de Mathématiques à l'Université Mohammed V. 
              Partage de connaissances et de ressources pédagogiques.
            </p>
          </div>
          <div>
            <p className="footer-title">Navigation</p>
            {[['/', 'Accueil'], ['/cours', 'Cours'], ['/articles', 'Articles'], ['/about', 'À Propos']].map(([href, label]) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </div>
          <div>
            <p className="footer-title">Contact</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>k.benali@um5.ac.ma</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6 }}>Département de Mathématiques</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Faculté des Sciences, Rabat</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} Prof. Karim Benali — Tous droits réservés.</p>
          <p className="footer-copy">Mathématiques · Sciences · Recherche</p>
        </div>
      </div>
    </footer>
  );
}
