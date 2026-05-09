'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ 
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, 
          width: '40px', height: '40px', borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' 
        }} 
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Changer le thème"
      title="Changer le thème"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '40px',
        height: '40px',
        padding: 0,
        borderRadius: '50%',
        backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
        color: theme === 'dark' ? '#fbd38d' : '#4a5568',
        boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${theme === 'dark' ? '#4a5568' : '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
