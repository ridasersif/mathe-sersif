import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Plateforme Pédagogique — Mathématiques', template: '%s | Plateforme Pédagogique' },
  description: 'Cours de mathématiques, articles de recherche et publications scientifiques.',
  keywords: ['mathématiques', 'cours', 'analyse', 'algèbre', 'professeur', 'université'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
