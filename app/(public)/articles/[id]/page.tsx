import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticle, getProfile } from '@/lib/api';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const article = await getArticle(id);
    return { title: article.title, description: article.excerpt };
  } catch {
    return { title: 'Article introuvable' };
  }
}

// Simple markdown-like renderer (no external deps)
function renderContent(content: string): string {
  return content
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^([^<].+)$/gm, (line) => line.startsWith('<') ? line : `<p>${line}</p>`);
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let article, profile;
  try { 
    [article, profile] = await Promise.all([getArticle(id), getProfile()]); 
  } catch { 
    try { article = await getArticle(id); } catch { notFound(); }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container" style={{ maxWidth: 800 }}>
          <Link href="/articles" className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>← Retour aux articles</Link>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {article.tags?.map((t: string) => <span key={t} className="tag">{t}</span>)}
          </div>
          <h1 className="title-lg" style={{ marginBottom: 14, lineHeight: 1.3 }}>{article.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <span>👨‍🏫 {profile?.fullName ? `Prof. ${profile.fullName}` : 'Professeur'}</span>
            <span>·</span>
            <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <article className="article-content">
            <div
              dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
            />
          </article>

          {/* Author Card */}
          <div className="card" style={{ marginTop: 48, maxWidth: 720, margin: '48px auto 0', display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', 
              background: profile?.photo ? `url(http://localhost:3002${profile.photo}) center/cover` : 'var(--gradient-accent)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '1.6rem', flexShrink: 0 
            }}>
              {!profile?.photo && '👨‍🏫'}
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{profile?.fullName || 'Professeur'}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {profile?.title || 'Professeur de Mathématiques'}. {profile?.institution || ''}
                <br />
                {profile?.bio || 'Partage de connaissances mathématiques.'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/articles" className="btn btn-outline">← Voir tous les articles</Link>
          </div>
        </div>
      </section>
    </>
  );
}
