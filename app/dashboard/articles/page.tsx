'use client';

import { useState, useEffect, FormEvent } from 'react';
import { getArticles, createArticle, updateArticle, deleteArticle, uploadImage, type Article } from '@/lib/api';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Newspaper,
  Calendar,
  Upload,
  Eye
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import Link from 'next/link';

const empty = { title: '', excerpt: '', content: '', tags: '', imageUrl: '', published: false };

export default function DashboardArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchArticles() {
    setFetching(true);
    try {
      // Get all articles including drafts
      const data = await getArticles(false);
      setArticles(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les articles');
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }
  useEffect(() => { fetchArticles(); }, []);

  function openAdd() { setEditing(null); setForm({ ...empty }); setImgFile(null); setError(''); setShowModal(true); }
  function openEdit(a: Article) {
    setEditing(a);
    setForm({ 
      title: a.title, 
      excerpt: a.excerpt, 
      content: a.content, 
      tags: a.tags?.join(', ') || '', 
      imageUrl: a.imageUrl || '',
      published: a.published 
    });
    setImgFile(null);
    setError(''); setShowModal(true);
  }
  function closeModal() { setShowModal(false); setEditing(null); setError(''); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      let imageUrl = form.imageUrl;

      if (imgFile) {
        const upData = await uploadImage(imgFile);
        imageUrl = upData.imageUrl;
      }

      const payload = { title: form.title, excerpt: form.excerpt, content: form.content, tags, imageUrl, published: form.published };
      
      if (editing) {
        await updateArticle(editing.id, payload);
        setSuccess('Article mis à jour.');
      } else {
        await createArticle(payload);
        setSuccess('Article créé.');
      }
      await fetchArticles();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur.');
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteArticle(deleteId);
      await fetchArticles();
      setSuccess('Article supprimé avec succès.'); 
      setDeleteId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  }

  async function togglePublish(a: Article) {
    try {
      await updateArticle(a.id, { published: !a.published });
      await fetchArticles();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-md">Gestion des Articles</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            {articles.filter(a => a.published).length} publiés · {articles.filter(a => !a.published).length} brouillons
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Nouvel article
        </button>
      </div>

      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      ) : articles.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Aperçu</th>
                <th>Titre</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ 
                      width: 50, height: 50, borderRadius: 8, overflow: 'hidden', 
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)' 
                    }}>
                      <img src={a.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=40&w=100'} 
                        alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, maxWidth: 260 }}>{a.title}</td>
                  <td>
                    <button 
                      onClick={() => togglePublish(a)} 
                      className={`btn btn-sm ${a.published ? 'btn-outline' : 'btn-ghost'}`} 
                      title="Cliquer pour changer le statut"
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      {a.published ? <CheckCircle2 size={14} /> : <FileText size={14} />}
                      {a.published ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/articles/${a.id}`} className="btn btn-ghost btn-sm" title="Voir sur le site">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => openEdit(a)} className="btn btn-ghost btn-sm" title="Modifier">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(a.id)} className="btn btn-danger btn-sm" title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Newspaper size={48} strokeWidth={1} />
          </div>
          <p className="empty-state-title">Aucun article</p>
          <p className="empty-state-text">Cliquez sur « Nouvel article » pour commencer à écrire.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Modifier l\'article' : 'Nouvel article'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            {error && (
              <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Titre de l'article" />
              </div>
              <div className="form-group">
                <label className="form-label">Image de couverture</label>
                <div className="upload-zone" onClick={() => document.getElementById('img-input')?.click()}>
                  <div className="upload-zone-icon">
                    <Upload size={24} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {imgFile ? imgFile.name : (form.imageUrl ? 'Changer l\'image' : 'Cliquez pour sélectionner une image')}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>JPG, PNG · Max 5 Mo</p>
                </div>
                <input id="img-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImgFile(e.target.files?.[0] || null)} />
              </div>
              {!imgFile && (
                <div className="form-group">
                  <label className="form-label">URL de l'image (si déjà hébergée)</label>
                  <input className="form-input" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="/uploads/mon-article.jpg" />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Extrait *</label>
                <textarea className="form-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required rows={2} placeholder="Résumé court affiché dans la liste..." />
              </div>
              <div className="form-group">
                <label className="form-label">Contenu * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Markdown supporté)</span></label>
                <textarea className="form-input" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={10} placeholder="# Titre&#10;&#10;Votre contenu ici..." style={{ fontFamily: 'monospace', fontSize: '0.875rem' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(séparés par des virgules)</span></label>
                <input className="form-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Algèbre, Recherche, Analyse" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  Publier immédiatement
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeModal} className="btn btn-ghost">Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <CheckCircle2 size={18} />}
                  {loading ? 'Enregistrement…' : (editing ? 'Mettre à jour' : 'Créer l\'article')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation */}
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Supprimer cet article ?"
        message="Cette action est irréversible. L'article sera définitivement supprimé."
      />
    </div>
  );
}
