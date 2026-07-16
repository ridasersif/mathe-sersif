import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// POST /api/courses — create a course
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await req.json();
  const admin = createAdminClient();

  const payload = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    pdf_url: data.pdfUrl,
    pdf_name: data.pdfName,
    image_url: data.imageUrl ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await admin.from('courses').insert(payload).select().single();
  if (error) {
    console.error('createCourse error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, course: result });
}
