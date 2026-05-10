'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 300 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-fadeUp" style={{ maxWidth: 440, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div style={{ padding: '0 32px 32px', textAlign: 'center' }}>
          <div style={{ 
            width: 64, height: 64, borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <AlertTriangle size={32} />
          </div>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 12, fontFamily: 'Playfair Display, serif' }}>
            {title}
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 32 }}>
            {message}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button 
              onClick={onClose} 
              className="btn btn-ghost"
              style={{ justifyContent: 'center' }}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button 
              onClick={onConfirm} 
              className="btn btn-danger"
              style={{ justifyContent: 'center', background: '#ef4444', color: '#fff' }}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
