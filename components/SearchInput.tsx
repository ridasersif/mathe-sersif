'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

export default function SearchInput({ 
  defaultValue = '', 
  placeholder = 'Rechercher…'
}: { 
  defaultValue?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleSearch(term: string) {
    setValue(term);
    
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // Reset to page 1 on search
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 600 }}>
      <Search 
        size={18} 
        style={{ 
          position: 'absolute', 
          left: 14, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          color: isPending ? 'var(--accent-blue)' : 'var(--text-muted)',
          transition: 'color 0.2s ease'
        }} 
      />
      <input 
        type="text" 
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="form-input" 
        style={{ 
          paddingLeft: 40, 
          paddingRight: value ? 40 : 14,
          borderColor: isPending ? 'var(--accent-blue)' : '' 
        }}
      />
      {value && (
        <button
          onClick={() => handleSearch('')}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
