'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Course } from '@/lib/api';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

const API = 'http://localhost:3001';
const AUTH = 'http://localhost:3002';
const CATEGORIES = ['Analyse', 'Algèbre', 'Probabilités', 'Topologie', 'Géométrie', 'Autre'];
const LEVELS = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];

const empty = { title: '', description: '', category: 'Analyse', level: 'Licence 1', pdfUrl: '', pdfName: '', imageUrl: '' };

export default function DashboardCoursPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchCourses() {
    const res = await fetch(`${API}/courses`);
    setCourses(await res.json());
  }
  useEffect(() => { fetchCourses(); }, []);

  function openAdd() { setEditing(null); setForm({ ...empty }); setPdfFile(null); setImgFile(null); setError(''); setShowModal(true); }
  function openEdit(c: Course) { 
    setEditing(c); 
    setForm({ 
      title: c.title, 
      description: c.description, 
      category: c.category, 
      level: c.level, 
      pdfUrl: c.pdfUrl, 
      pdfName: c.pdfName,
      imageUrl: c.imageUrl || ''
    }); 
    setPdfFile(null); 
    setImgFile(null);
    setError(''); 
    setShowModal(true); 
  }
  function closeModal() { setShowModal(false); setEditing(null); setError(''); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      let pdfUrl = form.pdfUrl, pdfName = form.pdfName;
      let imageUrl = form.imageUrl;

      if (pdfFile) {
        const fd = new FormData(); fd.append('pdf', pdfFile);
        const up = await fetch(`${AUTH}/upload`, { method: 'POST', body: fd });
        if (!up.ok) throw new Error('Erreur lors de l\'upload du PDF');
        const upData = await up.json();
        pdfUrl = upData.pdfUrl; pdfName = upData.pdfName;
      }

      if (imgFile) {
        const fd = new FormData(); fd.append('image', imgFile);
        const up = await fetch(`${AUTH}/upload-image`, { method: 'POST', body: fd });
        if (!up.ok) throw new Error('Erreur lors de l\'upload de l\'image');
        const upData = await up.json();
        imageUrl = upData.imageUrl;
      }

      const payload = { ...form, pdfUrl, pdfName, imageUrl };
      const now = new Date().toISOString();
      if (editing) {
        await fetch(`${API}/courses/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, updatedAt: now }) });
        setSuccess('Cours mis à jour avec succès.');
      } else {
        await fetch(`${API}/courses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, createdAt: now, updatedAt: now }) });
        setSuccess('Cours ajouté avec succès.');
      }
      await fetchCourses();
      closeModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce cours définitivement ?')) return;
    await fetch(`${API}/courses/${id}`, { method: 'DELETE' });
    await fetchCourses();
    setSuccess('Cours supprimé.'); setTimeout(() => setSuccess(''), 3000);
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="title-md">Gestion des Cours</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>{courses.length} cours au total</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} /> Ajouter un cours
        </button>
      </div>

      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      {courses.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Niveau</th>
                <th>PDF</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500, maxWidth: 220 }}>{c.title}</td>
                  <td><span className="tag">{c.category}</span></td>
                  <td><span className="tag tag-gold">{c.level}</span></td>
                  <td>
                    {c.pdfUrl ? (
                      <a href={c.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FileText size={14} /> PDF
                      </a>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(c)} className="btn btn-ghost btn-sm" title="Modifier">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm" title="Supprimer">
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
            <BookOpen size={48} strokeWidth={1} />
          </div>
          <p className="empty-state-title">Aucun cours</p>
          <p className="empty-state-text">Cliquez sur « Ajouter un cours » pour commencer.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Modifier le cours' : 'Ajouter un cours'}</h2>
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
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Ex: Analyse Mathématique I" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} placeholder="Description du cours..." />
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Niveau</label>
                  <select className="form-input" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
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
                  <input className="form-input" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="/uploads/mon-image.jpg" />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Fichier PDF *</label>
                <div className="upload-zone" onClick={() => document.getElementById('pdf-input')?.click()}>
                  <div className="upload-zone-icon">
                    <Upload size={24} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {pdfFile ? pdfFile.name : (editing?.pdfName || 'Cliquez pour sélectionner un PDF')}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>PDF uniquement · Max 50 Mo</p>
                </div>
                <input id="pdf-input" type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => setPdfFile(e.target.files?.[0] || null)} />
              </div>
              {!pdfFile && (
                <div className="form-group">
                  <label className="form-label">URL du PDF (si déjà hébergé)</label>
                  <input className="form-input" value={form.pdfUrl} onChange={e => setForm({ ...form, pdfUrl: e.target.value })} placeholder="/uploads/mon-cours.pdf" />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button type="button" onClick={closeModal} className="btn btn-ghost">Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <CheckCircle2 size={18} />}
                  {loading ? 'Enregistrement…' : (editing ? 'Mettre à jour' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
