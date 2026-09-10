import type { Metadata } from 'next';
import Link from 'next/link';
import { getCourses, type Course } from '@/lib/api';
import SearchInput from '@/components/SearchInput';

export const dynamic = 'force-dynamic';

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
  title: 'Cours de Mathématiques — Rachid Sersif',
  description:
    'Téléchargez librement les cours de mathématiques de Rachid Sersif en PDF — Analyse, Algèbre, Probabilités, Topologie, Géométrie. Niveau lycée et supérieur.',
  keywords: [
    'cours mathématiques PDF',
    'Rachid Sersif cours',
    'analyse mathématique',
    'algèbre linéaire',
    'probabilités',
    'topologie',
    'géométrie',
    'lycée maroc',
    'téléchargement cours',
  ],
  openGraph: {
    title: 'Cours de Mathématiques — Rachid Sersif',
    description:
      'Accédez librement aux cours de mathématiques de Rachid Sersif en PDF — Analyse, Algèbre, Probabilités et plus.',
  },
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

  let courses: Course[] = [];
  try { courses = await getCourses(); } catch {}

  // 1. Smart Filtering
  let filtered = [...courses];
  
  if (cat && cat !== 'Tous') {
    filtered = filtered.filter((c: Course) => c.category === cat);
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter((c: Course) => 
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
                {paginated.map((c: Course, index: number) => (
                  <div key={c.id} className="course-card-v2" style={{ animationDelay: `${index * 0.15}s` }}>
                    <div className="course-card-v2-image-box">
                      <img src={c.imageUrl || `https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800`} alt={c.title} />
                      <span className="course-card-v2-badge">{c.level}</span>
                      <div className="course-card-v2-icon">
                        {(() => {
                          const Icon = categoryIcons[c.category] || categoryIcons.default;
                          return <Icon size={24} />;
                        })()}
                      </div>
                    </div>
                    <div className="course-card-v2-content">
                      <div className="course-card-v2-category">{c.category}</div>
                      <h3 className="course-card-v2-title">{c.title}</h3>
                      <p className="course-card-v2-desc">{c.description}</p>
                      <div className="course-card-v2-actions">
                        <Link href={`/cours/${c.id}`} className="btn-pill btn-pill-primary">
                          <Eye size={16} />
                          Détails
                        </Link>
                        <a href={c.pdfUrl} download={c.pdfName} className="btn-pill btn-pill-accent">
                          <Download size={16} />
                          PDF
                        </a>
                      </div>
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
