import Link from 'next/link';
import { getCourses, getArticles, getProfile, type Course, type Article, type Profile } from '@/lib/api';
import HeroVisual from '@/components/HeroVisual';
import InteractiveMathCanvas from '@/components/InteractiveMathCanvas';
import GlowingMathSphere from '@/components/GlowingMathSphere';

export const dynamic = 'force-dynamic';

import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Download, 
  ArrowRight, 
  Mail, 
  Award, 
  Calendar,
  Users,
  Sigma,
  Variable,
  Dices,
  Orbit,
  Triangle
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'Analyse': Variable,
  'Algèbre': Sigma,
  'Probabilités': Dices,
  'Topologie': Orbit,
  'Géométrie': Triangle,
  'default': BookOpen,
};

export default async function HomePage() {
  let courses: Course[] = [];
  let articles: Article[] = [];
  let profile: Profile | null = null;
  try {
    const results = await Promise.all([getCourses(), getArticles(true), getProfile()]);
    courses = results[0];
    articles = results[1];
    profile = results[2];
  } catch {}

  const featCourses = courses.slice(0, 3);
  const featArticles = articles.slice(0, 3);

  const stats = [
    { label: 'Cours disponibles', value: profile?.stats?.courses || courses.length, icon: BookOpen, color: 'var(--accent-blue)' },
    { label: 'Publications', value: profile?.stats?.publications || articles.length, icon: FileText, color: 'var(--accent-gold)' },
    { label: "Années d'expérience", value: profile?.stats?.yearsOfExperience || 20, icon: Calendar, color: '#4ade80' },
  ];

  return (
    <>
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <InteractiveMathCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-grid">
            <div className="hero-content animate-fadeUp">
              <div className="hero-badge">
                <GraduationCap size={16} />
                <span>{profile?.title! }</span>
              </div>
              <h1 className="title-xl" style={{ marginBottom: 16 }}>
                Professeur{' '}
                <span className="gold-text">{profile?.fullName || '...'}</span>
              </h1>
              <p className="subtitle" style={{ marginBottom: 32 }}>
                {profile?.bio || "Bienvenue sur ma plateforme académique."}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/cours" className="btn btn-primary btn-lg">
                  <BookOpen size={20} style={{ marginRight: 8 }} />
                  Voir les cours
                </Link>
                <Link href="/about" className="btn btn-ghost btn-lg">
                  En savoir plus
                </Link>
              </div>
              <div className="hero-stats">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="hero-stat-value gradient-text">{s.value}+</div>
                    <div className="hero-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      <s.icon size={14} /> {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <HeroVisual photoUrl={profile?.photo} fullName={profile?.fullName} />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="label">Ressources pédagogiques</span>
            <h2 className="title-lg" style={{ marginTop: 8 }}>Cours récents</h2>
            <div className="divider" />
            <p className="subtitle">Accédez librement à tous les supports de cours en PDF.</p>
          </div>
          {featCourses.length > 0 ? (
            <div className="grid-3">
              {featCourses.map((c: Course) => (
                <div key={c.id} className="card course-card">
                  <div className="card-image">
                    <img src={c.imageUrl || `https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800`} alt={c.title} />
                  </div>
                  <div className="course-card-header">
                    <div className="course-icon">
                      {(() => {
                        const Icon = categoryIcons[c.category] || categoryIcons.default;
                        return <Icon size={24} />;
                      })()}
                    </div>
                    <span className="tag tag-gold">{c.level}</span>
                  </div>
                  <h3 className="course-title">{c.title}</h3>
                  <p className="course-desc">{c.description}</p>
                  <div className="course-meta">
                    <span className="tag">{c.category}</span>
                  </div>
                  <div className="course-actions">
                    <a href={c.pdfUrl} download={c.pdfName} className="btn btn-primary btn-sm">
                      <Download size={16} />
                      Télécharger
                    </a>
                    <Link href={`/cours/${c.id}`} className="btn btn-ghost btn-sm">
                      Détails
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <BookOpen size={48} strokeWidth={1} />
              </div>
              <p className="empty-state-title">Aucun cours disponible</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/cours" className="btn btn-outline btn-lg">
              Tous les cours <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="label">Recherche & Publications</span>
            <h2 className="title-lg" style={{ marginTop: 8 }}>Articles récents</h2>
            <div className="divider" />
          </div>
          {featArticles.length > 0 ? (
            <div className="grid-3">
              {featArticles.map((a: Article) => (
                <Link key={a.id} href={`/articles/${a.id}`} className="card article-card" style={{ display: 'flex' }}>
                  <div className="card-image">
                    <img src={a.imageUrl || `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800`} alt={a.title} />
                  </div>
                  <p className="article-card-date" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} />
                    {new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h3 className="article-card-title">{a.title}</h3>
                  <p className="article-card-excerpt">{a.excerpt}</p>
                  <div className="article-card-tags">
                    {a.tags?.map((t: string) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={48} strokeWidth={1} />
              </div>
              <p className="empty-state-title">Aucun article disponible</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/articles" className="btn btn-outline btn-lg">
              Tous les articles <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden', padding: '100px 0' }}>
        <GlowingMathSphere />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="label">Collaboration</span>
          <h2 className="title-lg" style={{ margin: '12px 0 16px' }}>Vous avez une question ?</h2>
          <p className="subtitle" style={{ maxWidth: 500, margin: '0 auto 32px' }}>
            N'hésitez pas à me contacter pour toute question académique ou collaboration de recherche.
          </p>
          <Link href="/about#contact" className="btn btn-gold btn-lg">
            <Mail size={20} style={{ marginRight: 8 }} />
            Me contacter
          </Link>
        </div>
      </section>
    </>
  );
}
