import type { Metadata } from 'next';
import Link from 'next/link';
import { getProfile, type Profile } from '@/lib/api';
import { 
  Users, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  GraduationCap, 
  BookOpen, 
  Clock,
  BarChart3,
  Award,
  Sigma
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'À Propos',
  description: 'Biographie et parcours académique du professeur.',
};

export default async function AboutPage() {
  let profile: Profile | null = null;
  try {
    profile = await getProfile();
  } catch {}

  const credentials: any[] = profile?.education || [];
  const specialties: string[] = profile?.specialties || [];

  const publications = [
    { title: 'On the regularity of solutions for a class of nonlinear elliptic equations', journal: 'Journal of Mathematical Analysis', year: '2023' },
    { title: 'Fixed point theorems in Banach spaces with applications', journal: 'Nonlinear Analysis', year: '2021' },
    { title: 'Spectral theory for unbounded operators in Hilbert spaces', journal: 'Functional Analysis and Its Applications', year: '2019' },
  ];
  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
            <div>
              <span className="label">Biographie</span>
              <h1 className="title-lg" style={{ marginTop: 8, marginBottom: 12 }}>
                {profile?.fullName || 'Chargement...'}
              </h1>
              <p className="subtitle" style={{ maxWidth: 560 }}>
                {profile?.bio || "Enseignant-chercheur en mathématiques."}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                <span className="tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} /> {profile?.institution || '...'}
                </span>
                <span className="tag tag-gold" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} /> {profile?.location || '...'}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: 140, height: 140, borderRadius: '50%', 
                background: profile?.photo ? `url(http://localhost:3002${profile.photo}) center/cover` : 'var(--gradient-accent)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '3rem', margin: '0 auto', 
                border: '3px solid rgba(79,142,247,0.3)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
              }}>
                {!profile?.photo && <Users size={60} color="#fff" strokeWidth={1} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div className="grid-2" style={{ gap: 32, marginBottom: 48 }}>
            {/* Biography */}
            <div>
              <h2 className="title-md" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={20} className="gold-text" /> Biographie
              </h2>
              <div className="divider" />
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                {profile?.bioLong || "Biographie non disponible."}
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="title-md" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <GraduationCap size={20} className="gold-text" /> Domaines de spécialité
              </h2>
              <div className="divider" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                {specialties.map((s: string) => (
                  <span key={s} className="tag" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>{s}</span>
                ))}
              </div>

              <h2 className="title-md" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <BarChart3 size={20} className="gold-text" /> Statistiques
              </h2>
              <div className="divider" />
              <div className="grid-2" style={{ gap: 12 }}>
                {[
                  { v: `${profile?.stats?.yearsOfExperience || 0}+`, l: "Années d'enseignement", i: Calendar },
                  { v: `${profile?.stats?.publications || 0}+`, l: 'Publications', i: FileText },
                  { v: `${profile?.stats?.courses || 0}`, l: 'Cours en ligne', i: BookOpen },
                  { v: `${profile?.stats?.students || 0}+`, l: 'Étudiants formés', i: Users },
                ].map(({ v, l, i: Icon }) => (
                  <div key={l} className="card stat-card" style={{ padding: '20px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Icon size={18} className="gold-text" opacity={0.6} />
                      <div className="stat-number gradient-text" style={{ fontSize: '1.6rem' }}>{v}</div>
                    </div>
                    <div className="stat-label" style={{ fontSize: '0.75rem' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div style={{ marginBottom: 48 }}>
            <h2 className="title-md" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={20} className="gold-text" /> Parcours académique
            </h2>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {credentials.map((c: any, idx: number) => (
                <div key={idx} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--gradient-accent)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, minWidth: 52, textAlign: 'center', color: '#fff' }}>
                    {c.year}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{c.degree}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div style={{ marginBottom: 48 }}>
            <h2 className="title-md" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={20} className="gold-text" /> Publications sélectionnées
            </h2>
            <div className="divider" />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Revue</th>
                    <th>Année</th>
                  </tr>
                </thead>
                <tbody>
                  {publications.map((p) => (
                    <tr key={p.title}>
                      <td style={{ fontStyle: 'italic' }}>{p.title}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.journal}</td>
                      <td><span className="tag">{p.year}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact */}
          <div id="contact" className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent-gold)' }}>
              <Mail size={32} />
            </div>
            <h2 className="title-md" style={{ marginBottom: 12 }}>Me contacter</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Pour toute question académique, collaboration de recherche ou demande d'information concernant les cours.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`mailto:${profile?.email || '...'}`} className="btn btn-primary btn-lg">
                {profile?.email || '...'}
              </a>
              <Link href="/cours" className="btn btn-ghost btn-lg">Voir les cours</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
