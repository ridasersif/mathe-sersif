import type { Metadata } from 'next';
import Link from 'next/link';
import { getCourses } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Cours de Mathématiques',
  description: 'Accédez librement à tous les cours de mathématiques en PDF — Analyse, Algèbre, Probabilités, Topologie et plus.',
};

const categoryIcons: Record<string, string> = {
  'Analyse': '∫', 'Algèbre': '⊕', 'Probabilités': '⚀',
  'Topologie': '⊙', 'Géométrie': '△', 'default': '∑',
};

const categories = ['Tous', 'Analyse', 'Algèbre', 'Probabilités', 'Topologie', 'Géométrie'];

export default async function CoursPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  let courses = [];
  try { courses = await getCourses(); } catch {}

  const filtered = cat && cat !== 'Tous'
    ? courses.filter((c: any) => c.category === cat)
    : courses;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="label">Ressources pédagogiques</span>
          <h1 className="title-lg" style={{ marginTop: 8, marginBottom: 12 }}>Cours de Mathématiques</h1>
          <p className="subtitle" style={{ maxWidth: 560 }}>
            Tous les supports de cours sont disponibles en téléchargement libre au format PDF.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/cours?cat=${c}`}
                className={`btn btn-sm ${cat === c || (!cat && c === 'Tous') ? 'btn-primary' : 'btn-ghost'}`}
              >
                {c}
              </Link>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid-3">
              {filtered.map((c: any) => (
                <div key={c.id} className="card course-card">
                  <div className="course-card-header">
                    <div className="course-icon">
                      {categoryIcons[c.category] || categoryIcons.default}
                    </div>
                    <span className="tag tag-gold">{c.level}</span>
                  </div>
                  <h2 className="course-title">{c.title}</h2>
                  <p className="course-desc">{c.description}</p>
                  <div className="course-meta">
                    <span className="tag">{c.category}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="course-actions">
                    <a href={c.pdfUrl} download={c.pdfName} className="btn btn-primary btn-sm">
                      ⬇ Télécharger PDF
                    </a>
                    <Link href={`/cours/${c.id}`} className="btn btn-ghost btn-sm">Voir</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📂</div>
              <p className="empty-state-title">Aucun cours trouvé</p>
              <p className="empty-state-text">Essayez une autre catégorie.</p>
              <Link href="/cours" className="btn btn-outline" style={{ marginTop: 16 }}>Voir tous les cours</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
