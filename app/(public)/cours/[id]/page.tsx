import type { Metadata } from 'next';
import Link from 'next/link';
import { getCourse } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const course = await getCourse(id);
    return { title: course.title, description: course.description };
  } catch {
    return { title: 'Cours introuvable' };
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let course;
  try { course = await getCourse(id); } catch { notFound(); }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <Link href="/cours" className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>← Retour aux cours</Link>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="tag">{course.category}</span>
            <span className="tag tag-gold">{course.level}</span>
          </div>
          <h1 className="title-lg" style={{ marginBottom: 12 }}>{course.title}</h1>
          <p className="subtitle" style={{ maxWidth: 600 }}>{course.description}</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={course.pdfUrl} download={course.pdfName} className="btn btn-primary btn-lg">
              ⬇ Télécharger le PDF
            </a>
            <a href={course.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-lg">
              👁 Ouvrir dans l'onglet
            </a>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 className="title-md" style={{ marginBottom: 16 }}>Aperçu du cours</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { label: 'Catégorie', value: course.category },
                { label: 'Niveau', value: course.level },
                { label: 'Format', value: 'PDF' },
                { label: 'Publié le', value: new Date(course.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="card">
            <h2 className="title-md" style={{ marginBottom: 16 }}>Visualisation du document</h2>
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', background: '#1a1a2e' }}>
              <iframe
                src={course.pdfUrl}
                width="100%"
                height="700px"
                title={course.title}
                style={{ display: 'block', border: 'none' }}
              />
            </div>
            <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Si le PDF ne s'affiche pas, <a href={course.pdfUrl} download className="btn-link" style={{ color: 'var(--accent-blue)' }}>cliquez ici pour le télécharger</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
