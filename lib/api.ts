import { createClient } from '@/utils/supabase/client';

export const supabase = createClient();

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

// ─── Upload helpers (use anon client — storage bucket must allow authenticated uploads) ───
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

// ─── Courses (reads: direct Supabase | writes: API routes with admin client) ────

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  if (error) throw new Error('Erreur lors du chargement des cours');
  return data.map(c => ({
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
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
  if (error || !data) throw new Error('Cours introuvable');
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    pdfUrl: data.pdf_url,
    pdfName: data.pdf_name,
    imageUrl: data.image_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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

// ─── Articles (reads: direct Supabase | writes: API routes with admin client) ───

export async function getArticles(publishedOnly = false): Promise<Article[]> {
  let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (publishedOnly) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) throw new Error('Erreur lors du chargement des articles');
  return data.map(a => ({
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
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
  if (error || !data) throw new Error('Article introuvable');
  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags,
    imageUrl: data.image_url,
    published: data.published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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

// ─── Profile (reads: direct Supabase | writes: API route with admin client) ────

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
  if (error) return null;
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
  } as any;
}

export async function updateProfile(data: any): Promise<Profile | null> {
  const res = await fetch('/api/profile/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur lors de la mise à jour du profil');
  return getProfile();
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error('Erreur lors du changement de mot de passe: ' + error.message);
}
