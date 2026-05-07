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

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface Profile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  photo: string;
  bio: string;
  bioLong: string;
  institution: string;
  faculty: string;
  department: string;
  location: string;
  specialties: string[];
  stats: {
    yearsOfExperience: number;
    publications: number;
    courses: number;
    students: number;
  };
  education: Array<{
    year: string;
    degree: string;
    institution: string;
  }>;
  socialLinks: {
    researchGate: string;
    googleScholar: string;
    linkedin: string;
    twitter: string;
  };
  updatedAt: string;
}

export async function getProfile(): Promise<Profile> {
  const res = await fetch(`${AUTH_BASE}/auth/profile`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur lors du chargement du profil');
  return res.json();
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const res = await fetch(`${AUTH_BASE}/auth/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour du profil');
  return res.json();
}

export async function uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await fetch(`${AUTH_BASE}/auth/upload-photo`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Erreur lors de l\'upload de la photo');
  return res.json();
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur lors du changement de mot de passe');
  }
}
