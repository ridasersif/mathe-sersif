'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { getCourses, getArticles, getProfile, supabase, type Course, type Article, type Profile } from '@/lib/api';
import { 
  BookMarked, 
  FileText, 
  Newspaper, 
  Globe,
  Plus,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAll = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const results = await Promise.all([getCourses(), getArticles(), getProfile()]);
      setCourses(results[0] as Course[]);
      setArticles(results[1] as Article[]);
      setProfile(results[2] as Profile);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    // Realtime: auto-refresh when courses or articles change in DB
    const coursesSub = supabase
      .channel('dashboard-courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        fetchAll();
      })
      .subscribe();

    const articlesSub = supabase
      .channel('dashboard-articles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
        fetchAll();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(coursesSub);
      supabase.removeChannel(articlesSub);
    };
  }, [fetchAll]);

  const publishedArticles = articles.filter((a: Article) => a.published);

  const stats = [
    { value: courses.length, label: 'Cours publiés', icon: BookMarked, href: '/dashboard/cours', color: 'var(--accent-blue)' },
    { value: articles.length, label: 'Articles au total', icon: FileText, href: '/dashboard/articles', color: 'var(--accent-gold)' },
    { value: publishedArticles.length, label: 'Articles publiés', icon: Newspaper, href: '/dashboard/articles', color: '#4ade80' },
    { value: courses.length + publishedArticles.length, label: 'Ressources en ligne', icon: Globe, href: '/', color: '#c084fc' },
  ];

  const recentCourses = [...courses]
    .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const recentArticles = [...articles]
    .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-md">Vue d'ensemble</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Bienvenue, {profile?.fullName ? `Professeur ${profile.lastName}` : 'Professeur'}. Gérez vos cours et articles depuis ce tableau de bord.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => fetchAll(true)}
            className="btn btn-ghost btn-sm"
            title="Actualiser les données"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            disabled={refreshing}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Actualisation…' : 'Actualiser'}
          </button>
          <Link href="/dashboard/cours" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouveau cours
          </Link>
          <Link href="/dashboard/articles" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouvel article
          </Link>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 0 2px rgba(74,222,128,0.25)',
          animation: 'pulse 2s ease-in-out infinite'
        }} />
        Données en temps réel · Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ height: 90, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.5 }} />
          ))}
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 16, marginBottom: 32 }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href} className="card stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: s.color, transition: 'all 0.3s ease' }}>{s.value}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
                  </div>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 12, 
                    background: 'var(--bg-secondary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color,
                    border: '1px solid var(--border)'
                  }}>
                    <Icon size={24} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Recent Courses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Cours récents</h2>
            <Link href="/dashboard/cours" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Gérer <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} className="card" style={{ height: 68, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.5 }} />)}
            </div>
          ) : recentCourses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentCourses.map((c: any) => (
                <div key={c.id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.category} · {c.level}</p>
                  </div>
                  <span className="tag" style={{ flexShrink: 0 }}>PDF</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Aucun cours</div>
          )}
        </div>

        {/* Recent Articles */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Articles récents</h2>
            <Link href="/dashboard/articles" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Gérer <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} className="card" style={{ height: 68, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.5 }} />)}
            </div>
          ) : recentArticles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentArticles.map((a: any) => (
                <div key={a.id} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`tag ${a.published ? '' : 'tag-gold'}`}>{a.published ? 'Publié' : 'Brouillon'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Aucun article</div>
          )}
        </div>
      </div>
    </div>
  );
}
