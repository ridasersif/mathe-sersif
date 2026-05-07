const API_BASE = 'http://localhost:3001';
const AUTH_BASE = 'http://localhost:3002';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  pdfUrl: string;
  pdfName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Courses ──────────────────────────────────────────────────────────────────
export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur lors du chargement des cours');
  return res.json();
}

export async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Cours introuvable');
  return res.json();
}

export async function createCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  const now = new Date().toISOString();
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, createdAt: now, updatedAt: now }),
  });
  if (!res.ok) throw new Error('Erreur lors de la création du cours');
  return res.json();
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<Course> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour du cours');
  return res.json();
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression du cours');
}

// ─── Articles ─────────────────────────────────────────────────────────────────
export async function getArticles(publishedOnly = false): Promise<Article[]> {
  const url = publishedOnly
    ? `${API_BASE}/articles?published=true`
    : `${API_BASE}/articles`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur lors du chargement des articles');
  return res.json();
}

export async function getArticle(id: string): Promise<Article> {
  const res = await fetch(`${API_BASE}/articles/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Article introuvable');
  return res.json();
}

export async function createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  const now = new Date().toISOString();
  const res = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, createdAt: now, updatedAt: now }),
  });
  if (!res.ok) throw new Error('Erreur lors de la création de l\'article');
  return res.json();
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour de l\'article');
  return res.json();
}

export async function deleteArticle(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression de l\'article');
}

// ─── Upload PDF ───────────────────────────────────────────────────────────────
export async function uploadPDF(file: File): Promise<{ pdfUrl: string; pdfName: string }> {
  const formData = new FormData();
  formData.append('pdf', file);
  const res = await fetch(`${AUTH_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Erreur lors de l\'upload du PDF');
  return res.json();
}
