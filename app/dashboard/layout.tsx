'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProfile, type Profile } from '@/lib/api';

import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  User, 
  ExternalLink, 
  LogOut,
  BookMarked,
  Newspaper
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { href: '/dashboard/cours', label: 'Cours', icon: BookMarked },
  { href: '/dashboard/articles', label: 'Articles', icon: Newspaper },
  { href: '/dashboard/profile', label: 'Mon Profil', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/image.png" alt="Logo" style={{ height: 32, width: 'auto' }} />
          <div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>Tableau de bord</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 10 }}>{profile ? `Prof. ${profile.lastName}` : '...'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/" target="_blank" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={14} /> Voir le site
          </Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '20px 10px', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 10px', marginBottom: 8 }}>Navigation</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <p style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 10px', marginBottom: 8, marginTop: 24 }}>Site public</p>
          {[
            { href: '/cours', label: 'Cours publiés', icon: BookOpen },
            { href: '/articles', label: 'Articles publiés', icon: FileText },
            { href: '/about', label: 'À propos', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} target="_blank" className="sidebar-link">
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '32px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
