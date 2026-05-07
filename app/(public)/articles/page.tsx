import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Articles & Recherche',
  description: 'Articles, publications et recherches en mathématiques du Professeur Benali.',
};

export default async function ArticlesPage() {
  let articles = [];
  try { articles = await getArticles(true); } catch {}

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="label">Publications académiques</span>
          <h1 className="title-lg" style={{ marginTop: 8, marginBottom: 12 }}>Articles & Recherche</h1>
          <p className="subtitle" style={{ maxWidth: 560 }}>
            Explorez mes publications, articles de recherche et réflexions sur les mathématiques modernes.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {articles.length > 0 ? (
            <div className="grid-3">
              {articles.map((a: any) => (
                <Link key={a.id} href={`/articles/${a.id}`} className="card article-card" style={{ display: 'block' }}>
                  <p className="article-card-date">
                    {new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 className="article-card-title">{a.title}</h2>
                  <p className="article-card-excerpt">{a.excerpt}</p>
                  <div className="article-card-tags">
                    {a.tags?.map((t: string) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 500 }}>
                    Lire l'article →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✍️</div>
              <p className="empty-state-title">Aucun article publié</p>
              <p className="empty-state-text">Les articles seront disponibles prochainement.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
