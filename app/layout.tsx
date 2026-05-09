import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export const metadata: Metadata = {
  title: { default: 'Plateforme Pédagogique — Mathématiques', template: '%s | Plateforme Pédagogique' },
  description: 'Cours de mathématiques, articles de recherche et publications scientifiques.',
  keywords: ['mathématiques', 'cours', 'analyse', 'algèbre', 'professeur', 'université'],
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
