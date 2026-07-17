// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE NOTE:
//
// READ functions (getProfile, getCourses, getArticles, getCourse, getArticle)
// are called from BOTH server and client components.
//
// SOLUTION: All reads go through our own API routes with cache: 'no-store'.
// This guarantees fresh data on every request — no Next.js fetch cache,
// no Vercel Edge CDN cache, no Supabase singleton cache.
//
// WRITE functions stay as-is (they already go through /api/* routes).
// UPLOAD functions use the browser Supabase client directly.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient as createBrowserClientFn } from '@/utils/supabase/client';

// Browser-only singleton (for uploads + auth + client-side realtime)
export const supabase = createBrowserClientFn();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  pdfUrl: string;
  pdfName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EducationItem {
  year: string;
  degree: string;
  institution: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  researchGate?: string;
  googleScholar?: string;
}

export interface Profile {
  id: string;
  userId: string;
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
    courses: number;
    publications: number;
    yearsOfExperience: number;
    students: number;
  };
  education: EducationItem[];
  socialLinks: SocialLinks;
  updatedAt: string;
}

// ─── Base URL helper (works on both server and client) ───────────────────────

function getBaseUrl(): string {
  // On the server, VERCEL_URL is set automatically; locally, use localhost
  if (typeof window !== 'undefined') return ''; // browser: relative URL is fine
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

// ─── Upload helpers (browser-client only) ────────────────────────────────────

export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, file);
  if (error) throw new Error("Erreur lors de l'upload de l'image");
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return { imageUrl: publicData.publicUrl };
}

export async function uploadPDF(file: File): Promise<{ pdfUrl: string; pdfName: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, file);
  if (error) throw new Error("Erreur lors de l'upload du PDF");
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return { pdfUrl: publicData.publicUrl, pdfName: file.name };
}

export async function uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
  const fileName = `profile-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const { error } = await supabase.storage.from('uploads').upload(fileName, file);
  if (error) throw new Error("Erreur lors de l'upload de la photo");
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return { photoUrl: publicData.publicUrl };
}

// ─── Profile — via API route, always fresh ────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/profile`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.profile;
    if (!data) return null;
    return {
      id: data.id,
      userId: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.full_name,
      title: data.title,
      email: data.email,
      phone: data.phone,
      photo: data.photo,
      bio: data.bio,
      bioLong: data.bio_long,
      institution: data.institution,
      faculty: data.faculty,
      department: data.department,
      location: data.location,
      specialties: data.specialties,
      stats: data.stats,
      education: data.education,
      socialLinks: data.social_links,
      updatedAt: data.updated_at,
    } as Profile;
  } catch {
    return null;
  }
}

export async function updateProfile(data: any): Promise<Profile | null> {
  const res = await fetch(`${getBaseUrl()}/api/profile/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur lors de la mise à jour du profil');
  return getProfile();
}

// ─── Courses — via API route, always fresh ────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${getBaseUrl()}/api/courses`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des cours');
  const json = await res.json();
  return (json.courses ?? []).map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    pdfUrl: c.pdf_url,
    pdfName: c.pdf_name,
    imageUrl: c.image_url,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }));
}

export async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${getBaseUrl()}/api/courses/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error('Cours introuvable');
  const json = await res.json();
  const c = json.course;
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    pdfUrl: c.pdf_url,
    pdfName: c.pdf_name,
    imageUrl: c.image_url,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

export async function createCourse(data: any): Promise<Course> {
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur lors de la création du cours');
  const c = json.course;
  return {
    id: c.id, title: c.title, description: c.description,
    category: c.category, level: c.level,
    pdfUrl: c.pdf_url, pdfName: c.pdf_name, imageUrl: c.image_url,
    createdAt: c.created_at, updatedAt: c.updated_at,
  };
}

export async function updateCourse(id: string, data: any): Promise<Course> {
  const res = await fetch(`/api/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur lors de la mise à jour du cours');
  const c = json.course;
  return {
    id: c.id, title: c.title, description: c.description,
    category: c.category, level: c.level,
    pdfUrl: c.pdf_url, pdfName: c.pdf_name, imageUrl: c.image_url,
    createdAt: c.created_at, updatedAt: c.updated_at,
  };
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur lors de la suppression du cours');
}

// ─── Articles — via API route, always fresh ───────────────────────────────────

export async function getArticles(publishedOnly = false): Promise<Article[]> {
  const url = publishedOnly
    ? `${getBaseUrl()}/api/articles?published=true`
    : `${getBaseUrl()}/api/articles`;
  const res = await fetch(url, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des articles');
  const json = await res.json();
  return (json.articles ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    tags: a.tags,
    imageUrl: a.image_url,
    published: a.published,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }));
}

export async function getArticle(id: string): Promise<Article> {
  const res = await fetch(`${getBaseUrl()}/api/articles/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error('Article introuvable');
  const json = await res.json();
  const a = json.article;
  return {
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    tags: a.tags,
    imageUrl: a.image_url,
    published: a.published,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

export async function createArticle(data: any): Promise<Article> {
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur lors de la création de l'article");
  const a = json.article;
  return {
    id: a.id, title: a.title, excerpt: a.excerpt, content: a.content,
    tags: a.tags, imageUrl: a.image_url, published: a.published,
    createdAt: a.created_at, updatedAt: a.updated_at,
  };
}

export async function updateArticle(id: string, data: any): Promise<Article> {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur lors de la mise à jour de l'article");
  const a = json.article;
  return {
    id: a.id, title: a.title, excerpt: a.excerpt, content: a.content,
    tags: a.tags, imageUrl: a.image_url, published: a.published,
    createdAt: a.created_at, updatedAt: a.updated_at,
  };
}

export async function deleteArticle(id: string): Promise<void> {
  const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur lors de la suppression de l'article");
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error('Erreur lors du changement de mot de passe: ' + error.message);
}
