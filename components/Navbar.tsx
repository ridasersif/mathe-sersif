'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/cours', label: 'Cours' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'À Propos' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">∑</div>
          <span>Prof. Benali</span>
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
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
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
