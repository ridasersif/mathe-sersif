'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProfile, type Profile } from '@/lib/api';

export default function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>∑</div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem' }}>
                {profile ? `Prof. ${profile.lastName}` : 'Mathématiques'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 300 }}>
              {profile?.bio || "Professeur de Mathématiques. Partage de connaissances et de ressources pédagogiques."}
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
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{profile?.email || 'contact@example.com'}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6 }}>{profile?.department || 'Département de Mathématiques'}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{profile?.institution || 'Université'}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} {profile?.fullName || 'Maths'} — Tous droits réservés.</p>
          <p className="footer-copy">Mathématiques · Sciences · Recherche</p>
        </div>
      </div>
    </footer>
  );
}
