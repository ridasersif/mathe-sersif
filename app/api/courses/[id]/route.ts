import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/courses/[id] — get a single course (no auth needed)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from('courses').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
  return NextResponse.json({ course: data });
}

// PUT /api/courses/[id] — update a course
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const admin = createAdminClient();

  const payload: any = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.category !== undefined) payload.category = data.category;
  if (data.level !== undefined) payload.level = data.level;
  if (data.pdfUrl !== undefined) payload.pdf_url = data.pdfUrl;
  if (data.pdfName !== undefined) payload.pdf_name = data.pdfName;
  if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;

  const { error } = await admin.from('courses').update(payload).eq('id', id);
  if (error) {
    console.error('updateCourse error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: updated } = await admin.from('courses').select('*').eq('id', id).single();
  return NextResponse.json({ success: true, course: updated });
}

// DELETE /api/courses/[id] — delete a course
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin.from('courses').delete().eq('id', id);
  if (error) {
    console.error('deleteCourse error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
