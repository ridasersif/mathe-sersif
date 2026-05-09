import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file);

  if (error) throw new Error("Erreur lors de l'upload de l'image");
  
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return { imageUrl: publicData.publicUrl };
}

// ─── Courses ──────────────────────────────────────────────────────────────────
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
  if (error) throw new Error('Erreur lors du chargement des cours');
  // Map snake_case to camelCase
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
    updatedAt: c.updated_at
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
    updatedAt: data.updated_at
  };
}

export async function createCourse(data: any): Promise<Course> {
  const payload = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    pdf_url: data.pdfUrl,
    pdf_name: data.pdfName,
    image_url: data.imageUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const { data: result, error } = await supabase.from('courses').insert(payload).select().single();
  if (error) throw new Error('Erreur lors de la création du cours: ' + error.message);
  return { ...data, id: result.id };
}

export async function updateCourse(id: string, data: any): Promise<Course> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.category !== undefined) payload.category = data.category;
  if (data.level !== undefined) payload.level = data.level;
  if (data.pdfUrl !== undefined) payload.pdf_url = data.pdfUrl;
  if (data.pdfName !== undefined) payload.pdf_name = data.pdfName;
  if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;

  const { data: result, error } = await supabase.from('courses').update(payload).eq('id', id).select().single();
  if (error) throw new Error('Erreur lors de la mise à jour du cours');
  return getCourse(id);
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw new Error('Erreur lors de la suppression du cours');
}

// ─── Articles ─────────────────────────────────────────────────────────────────
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
    updatedAt: a.updated_at
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
    updatedAt: data.updated_at
  };
}

export async function createArticle(data: any): Promise<Article> {
  const payload = {
    id: Date.now().toString(),
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags || [],
    image_url: data.imageUrl,
    published: data.published !== undefined ? data.published : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const { data: result, error } = await supabase.from('articles').insert(payload).select().single();
  if (error) throw new Error("Erreur lors de la création de l'article");
  return { ...data, id: result.id };
}

export async function updateArticle(id: string, data: any): Promise<Article> {
  const payload: any = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) payload.title = data.title;
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt;
  if (data.content !== undefined) payload.content = data.content;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;
  if (data.published !== undefined) payload.published = data.published;

  const { error } = await supabase.from('articles').update(payload).eq('id', id);
  if (error) throw new Error("Erreur lors de la mise à jour de l'article");
  return getArticle(id);
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw new Error("Erreur lors de la suppression de l'article");
}

// ─── Upload PDF ───────────────────────────────────────────────────────────────
export async function uploadPDF(file: File): Promise<{ pdfUrl: string; pdfName: string }> {
  const fileName = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file);

  if (error) throw new Error("Erreur lors de l'upload du PDF");
  
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return { pdfUrl: publicData.publicUrl, pdfName: file.name };
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
  if (error) return null; // No profile found or error
  return {
    id: data.id,
    user_id: data.id,
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
    updatedAt: data.updated_at
  } as any;
}

export async function updateProfile(data: any): Promise<Profile | null> {
  // Try to fetch existing to get its ID
  const existing = await getProfile();
  if (!existing) throw new Error('Profile introuvable');
  
  const payload: any = { updated_at: new Date().toISOString() };
  if (data.firstName !== undefined) payload.first_name = data.firstName;
  if (data.lastName !== undefined) payload.last_name = data.lastName;
  if (data.fullName !== undefined) payload.full_name = data.fullName;
  if (data.title !== undefined) payload.title = data.title;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.photo !== undefined) payload.photo = data.photo;
  if (data.bio !== undefined) payload.bio = data.bio;
  if (data.bioLong !== undefined) payload.bio_long = data.bioLong;
  if (data.institution !== undefined) payload.institution = data.institution;
  if (data.faculty !== undefined) payload.faculty = data.faculty;
  if (data.department !== undefined) payload.department = data.department;
  if (data.location !== undefined) payload.location = data.location;
  if (data.specialties !== undefined) payload.specialties = data.specialties;
  if (data.stats !== undefined) payload.stats = data.stats;
  if (data.education !== undefined) payload.education = data.education;
  if (data.socialLinks !== undefined) payload.social_links = data.socialLinks;

  const { error } = await supabase.from('profiles').update(payload).eq('id', existing.id);
  if (error) throw new Error('Erreur lors de la mise à jour du profil');
  return getProfile();
}

export async function uploadProfilePhoto(file: File): Promise<{ photoUrl: string }> {
  const fileName = `profile-${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file);

  if (error) throw new Error("Erreur lors de l'upload de la photo");
  
  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(fileName);
  return { photoUrl: publicData.publicUrl };
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error('Erreur lors du changement de mot de passe: ' + error.message);
}
