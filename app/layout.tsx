import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export const metadata: Metadata = {
  title: {
    default: 'Rachid Sersif — Professeur & Docteur en Mathématiques',
    template: '%s | Rachid Sersif',
  },
  description:
    "Rachid Sersif, Docteur en Math\u00e9matiques (2024) et Professeur de lyc\u00e9e depuis 2015. Passionn\u00e9 par l\u2019enseignement, la recherche et le partage des connaissances scientifiques. Cours, articles et publications en ligne.",
  keywords: [
    'Rachid Sersif',
    'math sersif',
    'sersif mathématiques',
    'cours mathématiques maroc',
    'professeur mathématiques lycée',
    'docteur mathématiques 2024',
    'analyse mathématique',
    'algèbre',
    'probabilités',
    'topologie',
    'géométrie',
    'رياضيات',
    'cours PDF mathématiques',
    'recherche mathématique',
  ],
  authors: [{ name: 'Rachid Sersif', url: 'https://mathe-sersif.vercel.app' }],
  creator: 'Rachid Sersif',
  metadataBase: new URL('https://mathe-sersif.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://mathe-sersif.vercel.app',
    siteName: 'Rachid Sersif — Mathématiques',
    title: 'Rachid Sersif — Professeur & Docteur en Mathématiques',
    description:
      'Docteur en Mathématiques (2024) et Professeur de lycée depuis 2015. Cours, articles de recherche et publications scientifiques.',
    images: [
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: 'Rachid Sersif — Plateforme Mathématiques',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rachid Sersif — Professeur & Docteur en Mathématiques',
    description:
      'Docteur en Mathématiques (2024) et Professeur de lycée depuis 2015. Cours, articles et publications en ligne.',
    images: ['/image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
