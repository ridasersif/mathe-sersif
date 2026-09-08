'use client';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function ContactSection({ profile }: { profile: any }) {
  return (
    <div className="contact-minimal-wrapper">
      <div className="contact-minimal-grid">
        {/* Left Side: Info */}
        <div className="contact-info-clean">
          <h3 className="title-md" style={{ marginBottom: '16px' }}>Contactez-nous</h3>
          <p className="subtitle" style={{ marginBottom: '40px', maxWidth: '400px' }}>
            Pour toute question académique, cours de soutien, ou collaboration de recherche, n'hésitez pas à envoyer un message.
          </p>

          <div className="contact-methods">
            <div className="contact-method-item">
              <div className="cm-icon"><Mail size={20} /></div>
              <div className="cm-text">
                <span>Email</span>
                <strong>{profile?.email || 'contact@example.com'}</strong>
              </div>
            </div>
            
            <div className="contact-method-item">
              <div className="cm-icon"><Phone size={20} /></div>
              <div className="cm-text">
                <span>Téléphone</span>
                <strong>{profile?.phone || '+212 600 000 000'}</strong>
              </div>
            </div>
            
            <div className="contact-method-item">
              <div className="cm-icon"><MapPin size={20} /></div>
              <div className="cm-text">
                <span>Localisation</span>
                <strong>{profile?.location || 'Maroc'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-clean">
          <form onSubmit={(e) => { e.preventDefault(); alert("Message envoyé !"); }}>
            <div className="form-row-2">
              <div className="form-group-clean">
                <input type="text" placeholder="Nom complet" required />
                <span className="focus-border"></span>
              </div>
              <div className="form-group-clean">
                <input type="email" placeholder="Adresse email" required />
                <span className="focus-border"></span>
              </div>
            </div>
            
            <div className="form-group-clean">
              <input type="text" placeholder="Sujet" required />
              <span className="focus-border"></span>
            </div>
            
            <div className="form-group-clean">
              <textarea rows={4} placeholder="Votre message..." required></textarea>
              <span className="focus-border"></span>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '16px', borderRadius: '30px', padding: '12px 32px' }}>
              Envoyer <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        .contact-minimal-wrapper {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 48px;
          box-shadow: var(--shadow-sm);
        }
        .contact-minimal-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .contact-method-item {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .cm-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--bg-secondary);
          color: var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          transition: transform 0.3s ease;
        }
        .contact-method-item:hover .cm-icon {
          transform: scale(1.05);
          color: var(--accent-blue);
          border-color: rgba(79, 142, 247, 0.3);
        }
        .cm-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cm-text span {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cm-text strong {
          font-size: 1.05rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .contact-form-clean {
          background: var(--bg-secondary);
          padding: 40px;
          border-radius: 20px;
          border: 1px solid var(--border);
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        .form-group-clean {
          position: relative;
          margin-bottom: 24px;
        }
        .form-group-clean input,
        .form-group-clean textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          padding: 12px 0;
          color: var(--text-primary);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .form-group-clean textarea {
          resize: vertical;
          min-height: 100px;
        }
        .form-group-clean input::placeholder,
        .form-group-clean textarea::placeholder {
          color: var(--text-muted);
        }
        
        .focus-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-blue);
          transition: 0.4s;
        }
        .form-group-clean input:focus ~ .focus-border,
        .form-group-clean textarea:focus ~ .focus-border {
          width: 100%;
        }
        
        @media (max-width: 900px) {
          .contact-minimal-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .contact-minimal-wrapper {
            padding: 24px;
          }
          .contact-form-clean {
            padding: 24px;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
