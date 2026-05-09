'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { getProfile, type Profile } from '@/lib/api';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/cours', label: 'Cours' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'À Propos' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo">
          <img src="/logo.svg" alt="Sersif Logo" style={{ height: 40, width: 'auto' }} />
          <span>{profile?.fullName ? `Prof. ${profile.lastName}` : 'Mathe Sersif'}</span>
        </Link>

        <div className="navbar-nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`navbar-link ${pathname === l.href ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="navbar-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              style={{ padding: '6px' }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {open && (
            <div className="navbar-mobile-menu">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="navbar-mobile-link"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
