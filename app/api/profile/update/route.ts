import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const data = await req.json();

  // Use admin client to bypass RLS
  const admin = createAdminClient();

  // Fetch existing profile to get its ID
  const { data: existing, error: fetchError } = await admin
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Profile introuvable' }, { status: 404 });
  }

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

  const { error } = await admin
    .from('profiles')
    .update(payload)
    .eq('id', existing.id);

  if (error) {
    console.error('Admin updateProfile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return the updated profile
  const { data: updated } = await admin.from('profiles').select('*').eq('id', existing.id).single();
  return NextResponse.json({ success: true, profile: updated });
}
