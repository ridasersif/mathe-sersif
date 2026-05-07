import type { Metadata } from 'next';
import Link from 'next/link';
import { getCourses } from '@/lib/api';
import SearchInput from '@/components/SearchInput';
import { 
  Variable, 
  Sigma, 
  Dices, 
  Orbit, 
  Triangle, 
  BookOpen, 
  Download, 
  Eye, 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cours de Mathématiques',
  description: 'Accédez librement à tous les cours de mathématiques en PDF — Analyse, Algèbre, Probabilités, Topologie et plus.',
};

const categoryIcons: Record<string, any> = {
  'Analyse': Variable, 
  'Algèbre': Sigma, 
  'Probabilités': Dices,
  'Topologie': Orbit, 
  'Géométrie': Triangle, 
  'default': BookOpen,
};

const categories = ['Tous', 'Analyse', 'Algèbre', 'Probabilités', 'Topologie', 'Géométrie'];

export default async function CoursPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ cat?: string; q?: string; page?: string }> 
}) {
  const { cat, q, page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const pageSize = 6;

  let courses = [];
  try { courses = await getCourses(); } catch {}

  // 1. Smart Filtering
  let filtered = [...courses];
  
  if (cat && cat !== 'Tous') {
    filtered = filtered.filter((c: any) => c.category === cat);
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter((c: any) => 
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.level.toLowerCase().includes(query)
    );
  }

  // 2. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

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
          {/* Search & Filter bar */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <SearchInput defaultValue={q} />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/cours?cat=${c}${q ? `&q=${q}` : ''}`}
                  className={`btn btn-sm ${cat === c || (!cat && c === 'Tous') ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {paginated.length > 0 ? (
            <>
              <div className="grid-3">
                {paginated.map((c: any) => (
                  <div key={c.id} className="card course-card animate-fadeUp">
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
                    <h2 className="course-title">{c.title}</h2>
                    <p className="course-desc">{c.description}</p>
                    <div className="course-meta">
                      <span className="tag">{c.category}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="course-actions">
                      <a href={c.pdfUrl} download={c.pdfName} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Download size={14} /> Télécharger
                      </a>
                      <Link href={`/cours/${c.id}`} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Eye size={14} /> Voir
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 48 }}>
                  <Link 
                    href={`/cours?page=${currentPage - 1}${cat ? `&cat=${cat}` : ''}${q ? `&q=${q}` : ''}`}
                    className={`btn btn-ghost btn-sm ${currentPage <= 1 ? 'disabled' : ''}`}
                    style={{ pointerEvents: currentPage <= 1 ? 'none' : 'auto', opacity: currentPage <= 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} /> Précédent
                  </Link>
                  
                  <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Link
                        key={i}
                        href={`/cours?page=${i + 1}${cat ? `&cat=${cat}` : ''}${q ? `&q=${q}` : ''}`}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ minWidth: 36, padding: '0 8px' }}
                      >
                        {i + 1}
                      </Link>
                    ))}
                  </div>

                  <Link 
                    href={`/cours?page=${currentPage + 1}${cat ? `&cat=${cat}` : ''}${q ? `&q=${q}` : ''}`}
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
              <p className="empty-state-title">Aucun cours trouvé</p>
              <p className="empty-state-text">
                {q ? `Aucun résultat pour "${q}"` : 'Essayez une autre catégorie.'}
              </p>
              <Link href="/cours" className="btn btn-outline" style={{ marginTop: 16 }}>Voir tous les cours</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
