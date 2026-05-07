import Link from 'next/link';
import { getCourses, getArticles, getProfile, type Course, type Article, type Profile } from '@/lib/api';
import { 
  BookMarked, 
  FileText, 
  Newspaper, 
  Globe,
  Plus,
  ArrowRight
} from 'lucide-react';

export default async function DashboardPage() {
  let courses: Course[] = [], articles: Article[] = [], publishedArticles: Article[] = [], profile: Profile | null = null;
  try {
    const results = await Promise.all([getCourses(), getArticles(), getProfile()]);
    courses = results[0] as Course[];
    articles = results[1] as Article[];
    profile = results[2] as Profile;
    publishedArticles = articles.filter((a: Article) => a.published);
  } catch {}

  const stats = [
    { value: courses.length, label: 'Cours publiés', icon: BookMarked, href: '/dashboard/cours', color: 'var(--accent-blue)' },
    { value: articles.length, label: 'Articles au total', icon: FileText, href: '/dashboard/articles', color: 'var(--accent-gold)' },
    { value: publishedArticles.length, label: 'Articles publiés', icon: Newspaper, href: '/dashboard/articles', color: '#4ade80' },
    { value: courses.length + publishedArticles.length, label: 'Ressources en ligne', icon: Globe, href: '/', color: '#c084fc' },
  ];

  const recentCourses = [...courses].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
  const recentArticles = [...articles].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-md">Vue d'ensemble</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            Bienvenue, {profile?.fullName ? `Professeur ${profile.lastName}` : 'Professeur'}. Gérez vos cours et articles depuis ce tableau de bord.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/cours" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouveau cours
          </Link>
          <Link href="/dashboard/articles" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouvel article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-2" style={{ gap: 16, marginBottom: 32 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="card stat-card" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: s.color }}>{s.value}</div>
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

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Recent Courses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Cours récents</h2>
            <Link href="/dashboard/cours" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Gérer <ArrowRight size={14} />
            </Link>
          </div>
          {recentCourses.length > 0 ? (
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
          {recentArticles.length > 0 ? (
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
