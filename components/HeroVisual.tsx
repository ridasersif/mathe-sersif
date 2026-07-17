'use client';

import { useEffect, useRef } from 'react';

interface HeroVisualProps {
  photoUrl?: string;
  fullName?: string;
}

export default function HeroVisual({ photoUrl, fullName }: HeroVisualProps) {
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;

    function animate() {
      t += 0.5;

      // Orbital rings rotation
      if (ring1Ref.current) {
        ring1Ref.current.style.transform = `rotateX(70deg) rotateZ(${t * 1.1}deg)`;
      }
      if (ring2Ref.current) {
        ring2Ref.current.style.transform = `rotateX(20deg) rotateY(${t * 0.7}deg)`;
      }
      if (ring3Ref.current) {
        ring3Ref.current.style.transform = `rotateX(50deg) rotateY(${t * 1.4}deg) rotateZ(45deg)`;
      }

      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="hero-avatar-wrap">
      {/* ── Photo + Atom rings ───────────────────────── */}
      <div className="hero-atom-system">
        <div className="atom-ring atom-ring-1" ref={ring1Ref}>
          <div className="atom-electron atom-electron-blue" />
        </div>
        <div className="atom-ring atom-ring-2" ref={ring2Ref}>
          <div className="atom-electron atom-electron-purple" />
        </div>
        <div className="atom-ring atom-ring-3" ref={ring3Ref}>
          <div className="atom-electron atom-electron-cyan" />
        </div>

        {/* Photo inside center */}
        <div className="hero-photo-ring">
          <div className="hero-photo-inner">
            {photoUrl ? (
              <img src={photoUrl} alt={fullName || 'Professeur'} className="hero-photo-img" />
            ) : (
              <div className="hero-photo-fallback">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
          {/* Orbiting ring dot */}
          <div className="hero-photo-orbit">
            <div className="hero-photo-orbit-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
