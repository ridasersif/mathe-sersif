import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À Propos',
  description: 'Biographie et parcours académique du Professeur Karim Benali, mathématicien et enseignant-chercheur.',
};

const credentials = [
  { year: '2003', degree: 'Doctorat en Mathématiques Pures', school: 'Université Paris VI (Sorbonne)' },
  { year: '1999', degree: 'Master en Analyse Fonctionnelle', school: 'Université Mohammed V, Rabat' },
  { year: '1997', degree: 'Licence en Mathématiques', school: 'Université Mohammed V, Rabat' },
];

const specialties = ['Analyse Fonctionnelle', 'Topologie Algébrique', 'Équations aux Dérivées Partielles', 'Théorie des Opérateurs', 'Mathématiques Appliquées', 'Méthodes Numériques'];

const publications = [
  { title: 'On the regularity of solutions for a class of nonlinear elliptic equations', journal: 'Journal of Mathematical Analysis', year: '2023' },
  { title: 'Fixed point theorems in Banach spaces with applications', journal: 'Nonlinear Analysis', year: '2021' },
  { title: 'Spectral theory for unbounded operators in Hilbert spaces', journal: 'Functional Analysis and Its Applications', year: '2019' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
            <div>
              <span className="label">Biographie</span>
              <h1 className="title-lg" style={{ marginTop: 8, marginBottom: 12 }}>Professeur Karim Benali</h1>
              <p className="subtitle" style={{ maxWidth: 560 }}>
                Enseignant-chercheur en mathématiques pures et appliquées, 
                avec plus de 20 ans d'expérience dans l'enseignement supérieur et la recherche scientifique.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                <span className="tag">Université Mohammed V</span>
                <span className="tag tag-gold">Rabat, Maroc</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto', border: '3px solid rgba(79,142,247,0.3)' }}>
                👨‍🏫
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
              <h2 className="title-md" style={{ marginBottom: 8 }}>Biographie</h2>
              <div className="divider" />
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 16 }}>
                Né à Rabat en 1975, le Professeur Karim Benali est titulaire d'un doctorat en mathématiques pures 
                de l'Université Paris VI (Sorbonne). Il est actuellement professeur habilité au département de 
                mathématiques de la Faculté des Sciences de Rabat, Université Mohammed V.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 16 }}>
                Ses recherches portent principalement sur l'analyse fonctionnelle, les équations aux dérivées 
                partielles et la topologie algébrique. Il a publié plus de 30 articles dans des revues 
                mathématiques internationales indexées.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                En parallèle de ses activités de recherche, il s'engage activement dans la pédagogie mathématique 
                et partage librement ses cours avec ses étudiants et la communauté scientifique marocaine.
              </p>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="title-md" style={{ marginBottom: 8 }}>Domaines de spécialité</h2>
              <div className="divider" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                {specialties.map((s) => (
                  <span key={s} className="tag" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>{s}</span>
                ))}
              </div>

              <h2 className="title-md" style={{ marginBottom: 8 }}>Statistiques</h2>
              <div className="divider" />
              <div className="grid-2" style={{ gap: 12 }}>
                {[
                  { v: '20+', l: 'Années d\'enseignement' },
                  { v: '30+', l: 'Publications' },
                  { v: '6', l: 'Cours en ligne' },
                  { v: '500+', l: 'Étudiants formés' },
                ].map(({ v, l }) => (
                  <div key={l} className="card stat-card" style={{ padding: '20px 16px' }}>
                    <div className="stat-number gradient-text">{v}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div style={{ marginBottom: 48 }}>
            <h2 className="title-md" style={{ marginBottom: 8 }}>Parcours académique</h2>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {credentials.map((c) => (
                <div key={c.year} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ background: 'var(--gradient-accent)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, minWidth: 52, textAlign: 'center' }}>
                    {c.year}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{c.degree}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div style={{ marginBottom: 48 }}>
            <h2 className="title-md" style={{ marginBottom: 8 }}>Publications sélectionnées</h2>
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
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✉️</div>
            <h2 className="title-md" style={{ marginBottom: 12 }}>Me contacter</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Pour toute question académique, collaboration de recherche ou demande d'information concernant les cours.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:k.benali@um5.ac.ma" className="btn btn-primary btn-lg">k.benali@um5.ac.ma</a>
              <Link href="/cours" className="btn btn-ghost btn-lg">Voir les cours</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
