import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, type Article } from '@/lib/api';
import { Newspaper, Search, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import SearchInput from '@/components/SearchInput';

export const metadata: Metadata = {
  title: 'Articles & Recherche — Rachid Sersif',
  description:
    'Articles de recherche, publications et réflexions en mathématiques par Rachid Sersif, Docteur en Mathématiques. Analyse, algèbre, probabilités et plus.',
  keywords: ['articles mathématiques', 'recherche', 'publications', 'Rachid Sersif', 'analyse', 'algèbre'],
  openGraph: {
    title: 'Articles & Recherche — Rachid Sersif',
    description: 'Découvrez les publications et articles de recherche en mathématiques de Rachid Sersif.',
  },
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}) {
  const { q, tag, page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const pageSize = 6;

  let articles: Article[] = [];
  try { articles = await getArticles(true); } catch {}

  // Collect all unique tags
  const allTags = Array.from(new Set(articles.flatMap((a: Article) => a.tags || [])));

  // Filter by search query
  let filtered = [...articles];
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter((a: Article) =>
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      (a.tags || []).some((t: string) => t.toLowerCase().includes(query))
    );
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter((a: Article) => (a.tags || []).includes(tag));
  }

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

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
          {/* Search & Filter bar */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <SearchInput defaultValue={q} placeholder="Rechercher un article…" />
            </div>

            {allTags.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={13} /> Tags :
                </span>
                <Link
                  href={`/articles${q ? `?q=${q}` : ''}`}
                  className={`btn btn-sm ${!tag ? 'btn-primary' : 'btn-ghost'}`}
                >
                  Tous
                </Link>
                {allTags.map((t) => (
                  <Link
                    key={t}
                    href={`/articles?tag=${encodeURIComponent(t)}${q ? `&q=${q}` : ''}`}
                    className={`btn btn-sm ${tag === t ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}

            {(q || tag) && (
              <p style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {totalItems} résultat{totalItems !== 1 ? 's' : ''}{q ? ` pour "${q}"` : ''}{tag ? ` · tag: ${tag}` : ''}
                {' '}·{' '}
                <Link href="/articles" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Effacer les filtres</Link>
              </p>
            )}
          </div>

          {paginated.length > 0 ? (
            <>
              <div className="grid-3">
                {paginated.map((a: Article) => (
                  <Link key={a.id} href={`/articles/${a.id}`} className="card article-card" style={{ display: 'flex' }}>
                    <div className="card-image">
                      <img src={a.imageUrl || `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800`} alt={a.title} />
                    </div>
                    <p className="article-card-date" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={13} />
                      {new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h2 className="article-card-title">{a.title}</h2>
                    <p className="article-card-excerpt">{a.excerpt}</p>
                    <div className="article-card-tags">
                      {(a.tags || []).map((t: string) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 500 }}>
                      Lire l'article →
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 48 }}>
                  <Link
                    href={`/articles?page=${currentPage - 1}${tag ? `&tag=${tag}` : ''}${q ? `&q=${q}` : ''}`}
                    className={`btn btn-ghost btn-sm ${currentPage <= 1 ? 'disabled' : ''}`}
                    style={{ pointerEvents: currentPage <= 1 ? 'none' : 'auto', opacity: currentPage <= 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} /> Précédent
                  </Link>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Link
                        key={i}
                        href={`/articles?page=${i + 1}${tag ? `&tag=${tag}` : ''}${q ? `&q=${q}` : ''}`}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ minWidth: 36, padding: '0 8px' }}
                      >
                        {i + 1}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/articles?page=${currentPage + 1}${tag ? `&tag=${tag}` : ''}${q ? `&q=${q}` : ''}`}
                    className={`btn btn-ghost btn-sm ${currentPage >= totalPages ? 'disabled' : ''}`}
                    style={{ pointerEvents: currentPage >= totalPages ? 'none' : 'auto', opacity: currentPage >= totalPages ? 0.5 : 1 }}
                  >
                    Suivant <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={48} strokeWidth={1} />
              </div>
              <p className="empty-state-title">Aucun article trouvé</p>
              <p className="empty-state-text">
                {q ? `Aucun résultat pour "${q}"` : tag ? `Aucun article avec le tag "${tag}"` : 'Aucun article publié pour le moment.'}
              </p>
              <Link href="/articles" className="btn btn-outline" style={{ marginTop: 16 }}>Voir tous les articles</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
