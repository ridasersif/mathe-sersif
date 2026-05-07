import Link from 'next/link';
import { getCourses } from '@/lib/api';
import { getArticles } from '@/lib/api';

const categoryIcons: Record<string, string> = {
  'Analyse': '∫', 'Algèbre': '⊕', 'Probabilités': '🎲',
  'Topologie': '⊙', 'Géométrie': '△', 'default': '∑',
};

export default async function HomePage() {
  let courses = [];
  let articles = [];
  try {
    [courses, articles] = await Promise.all([getCourses(), getArticles(true)]);
  } catch {}
  const featCourses = courses.slice(0, 3);
  const featArticles = articles.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content animate-fadeUp">
              <div className="hero-badge">
                <span>🎓</span>
                <span>Professeur de Mathématiques</span>
              </div>
              <h1 className="title-xl" style={{ marginBottom: 16 }}>
                Professeur{' '}
                <span className="gold-text">Karim Benali</span>
              </h1>
              <p className="subtitle" style={{ marginBottom: 32 }}>
                Bienvenue sur ma plateforme académique. Explorez mes cours, 
                articles de recherche et publications en mathématiques pures et appliquées.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/cours" className="btn btn-primary btn-lg">
                  📚 Voir les cours
                </Link>
                <Link href="/about" className="btn btn-ghost btn-lg">
                  En savoir plus
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value gradient-text">{courses.length || '15'}+</div>
                  <div className="hero-stat-label">Cours disponibles</div>
                </div>
                <div>
                  <div className="hero-stat-value gradient-text">{articles.length || '30'}+</div>
                  <div className="hero-stat-label">Publications</div>
                </div>
                <div>
                  <div className="hero-stat-value gradient-text">20+</div>
                  <div className="hero-stat-label">Années d'expérience</div>
                </div>
              </div>
            </div>
            <div className="hero-avatar-wrap">
              <div className="hero-avatar">👨‍🏫</div>
            </div>
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
              {featCourses.map((c: any) => (
                <div key={c.id} className="card course-card">
                  <div className="course-card-header">
                    <div className="course-icon">
                      {categoryIcons[c.category] || categoryIcons.default}
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
                      ⬇ Télécharger
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
              <div className="empty-state-icon">📂</div>
              <p className="empty-state-title">Aucun cours disponible</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/cours" className="btn btn-outline btn-lg">Tous les cours →</Link>
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
              {featArticles.map((a: any) => (
                <Link key={a.id} href={`/articles/${a.id}`} className="card article-card" style={{ display: 'block' }}>
                  <p className="article-card-date">
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
              <div className="empty-state-icon">✍️</div>
              <p className="empty-state-title">Aucun article disponible</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/articles" className="btn btn-outline btn-lg">Tous les articles →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="label">Collaboration</span>
          <h2 className="title-lg" style={{ margin: '12px 0 16px' }}>Vous avez une question ?</h2>
          <p className="subtitle" style={{ maxWidth: 500, margin: '0 auto 32px' }}>
            N'hésitez pas à me contacter pour toute question académique ou collaboration de recherche.
          </p>
          <Link href="/about#contact" className="btn btn-gold btn-lg">✉️ Me contacter</Link>
        </div>
      </section>
    </>
  );
}
