import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// POST /api/articles — create an article
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await req.json();
  const admin = createAdminClient();

  const payload = {
    id: Date.now().toString(),
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags || [],
    image_url: data.imageUrl ?? null,
    published: data.published !== undefined ? data.published : true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await admin.from('articles').insert(payload).select().single();
  if (error) {
    console.error('createArticle error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, article: result });
}
