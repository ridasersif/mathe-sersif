'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { getProfile, type Profile } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/cours', label: 'Cours' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'À Propos' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});

    // Check Supabase auth state
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });

    // Listen to auth state changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      router.push('/');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo">
          <img src="/logo.svg" alt="Sersif Logo" style={{ height: 40, width: 'auto' }} />
          <span>{profile?.fullName ? `Prof. ${profile.lastName}` : 'Mathe Sersif'}</span>
        </Link>

        {/* Desktop nav */}
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

          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`navbar-link navbar-admin-btn ${pathname.startsWith('/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={15} style={{ marginRight: 5 }} />
                Dashboard
              </Link>
              <button
                className="btn btn-ghost btn-sm navbar-logout-btn"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Se déconnecter"
              >
                <LogOut size={16} />
                {loggingOut ? '...' : 'Déconnexion'}
              </button>
            </>
          )}
        </div>

        {/* Mobile nav */}
        <div className="navbar-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLoggedIn && (
              <Link href="/dashboard" className="btn btn-ghost btn-sm" title="Dashboard" style={{ padding: '6px 8px' }}>
                <LayoutDashboard size={18} />
              </Link>
            )}
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
              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className="navbar-mobile-link"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard size={15} style={{ marginRight: 6 }} />
                    Dashboard
                  </Link>
                  <button
                    className="navbar-mobile-link navbar-logout-mobile"
                    onClick={() => { setOpen(false); handleLogout(); }}
                    disabled={loggingOut}
                  >
                    <LogOut size={15} style={{ marginRight: 6 }} />
                    {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
