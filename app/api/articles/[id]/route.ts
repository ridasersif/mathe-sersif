import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// PUT /api/articles/[id] — update an article
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const admin = createAdminClient();

  const payload: any = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) payload.title = data.title;
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt;
  if (data.content !== undefined) payload.content = data.content;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.imageUrl !== undefined) payload.image_url = data.imageUrl;
  if (data.published !== undefined) payload.published = data.published;

  const { error } = await admin.from('articles').update(payload).eq('id', id);
  if (error) {
    console.error('updateArticle error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: updated } = await admin.from('articles').select('*').eq('id', id).single();
  return NextResponse.json({ success: true, article: updated });
}

// DELETE /api/articles/[id] — delete an article
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin.from('articles').delete().eq('id', id);
  if (error) {
    console.error('deleteArticle error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
