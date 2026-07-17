'use client';

import { useEffect, useRef } from 'react';

interface HeroVisualProps {
  photoUrl?: string;
  fullName?: string;
}

const PARTICLES = [
  { sym: '∑', top: '8%',  left: '4%',  delay: '0s',    size: '1.3rem', color: '#4f8ef7' },
  { sym: '∫', top: '18%', right: '6%', delay: '0.6s',  size: '1.5rem', color: '#a78bfa' },
  { sym: 'π', top: '72%', left: '2%',  delay: '1.2s',  size: '1.1rem', color: '#4f8ef7' },
  { sym: '∞', top: '80%', right: '4%', delay: '1.8s',  size: '1.4rem', color: '#c084fc' },
  { sym: 'Δ', top: '45%', left: '0%',  delay: '0.3s',  size: '1rem',   color: '#38bdf8' },
  { sym: 'λ', top: '35%', right: '2%', delay: '2.1s',  size: '0.95rem',color: '#a78bfa' },
  { sym: 'φ', top: '92%', left: '25%', delay: '0.9s',  size: '1rem',   color: '#4f8ef7' },
  { sym: 'ε', top: '5%',  right: '22%',delay: '1.5s',  size: '0.85rem',color: '#34d399' },
  { sym: 'θ', top: '60%', right: '0%', delay: '2.7s',  size: '1.1rem', color: '#38bdf8' },
];

const GLYPHS = ['∑', '∫', 'π', '∞', 'Δ', '∇', 'φ', 'λ'];

export default function HeroVisual({ photoUrl, fullName }: HeroVisualProps) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  
  // Sine/Cosine Graphic Refs
  const sinPathRef = useRef<SVGPathElement>(null);
  const cosPathRef = useRef<SVGPathElement>(null);
  const circlePointRef = useRef<SVGCircleElement>(null);
  const radiusLineRef = useRef<SVGLineElement>(null);
  const connectionLineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;

    function animate() {
      t += 0.5;
      const rad = (t * Math.PI) / 180;

      // 1. Cube slow wobble rotation
      if (cubeRef.current) {
        const rx = 15 + Math.sin(rad * 0.7) * 12;
        const ry = t * 0.8;
        cubeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }

      // 2. Orbital rings
      if (ring1Ref.current) {
        ring1Ref.current.style.transform = `rotateX(70deg) rotateZ(${t * 1.1}deg)`;
      }
      if (ring2Ref.current) {
        ring2Ref.current.style.transform = `rotateX(20deg) rotateY(${t * 0.7}deg)`;
      }
      if (ring3Ref.current) {
        ring3Ref.current.style.transform = `rotateX(50deg) rotateY(${t * 1.4}deg) rotateZ(45deg)`;
      }

      // 3. Trigonometric Sine & Cosine Calculation
      const circleCx = 45;
      const circleCy = 50;
      const circleRadius = 28;

      const px = circleCx + circleRadius * Math.cos(rad * 1.5);
      const py = circleCy - circleRadius * Math.sin(rad * 1.5);

      if (circlePointRef.current) {
        circlePointRef.current.setAttribute('cx', px.toString());
        circlePointRef.current.setAttribute('cy', py.toString());
      }
      if (radiusLineRef.current) {
        radiusLineRef.current.setAttribute('x2', px.toString());
        radiusLineRef.current.setAttribute('y2', py.toString());
      }
      if (connectionLineRef.current) {
        connectionLineRef.current.setAttribute('x1', px.toString());
        connectionLineRef.current.setAttribute('y1', py.toString());
        connectionLineRef.current.setAttribute('x2', '110');
        connectionLineRef.current.setAttribute('y2', py.toString());
      }

      // Sine/Cosine Wave paths (from x=110 to x=310)
      let sineD = '';
      let cosineD = '';
      for (let x = 110; x <= 310; x += 2) {
        const xOffset = x - 110;
        const angle = (xOffset / 16) - (rad * 1.5);
        const ySin = circleCy - Math.sin(angle) * circleRadius;
        const yCos = circleCy - Math.cos(angle) * circleRadius;

        if (x === 110) {
          sineD += `M ${x} ${ySin}`;
          cosineD += `M ${x} ${yCos}`;
        } else {
          sineD += ` L ${x} ${ySin}`;
          cosineD += ` L ${x} ${yCos}`;
        }
      }

      if (sinPathRef.current) sinPathRef.current.setAttribute('d', sineD);
      if (cosPathRef.current) cosPathRef.current.setAttribute('d', cosineD);

      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="hero-visual-wrap">

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

      {/* ── Geometric Sine & Cosine Trigonometric Panel ── */}
      <div className="math-waves-panel">
        <div className="panel-title">Trigonométrie Active : sin(x) / cos(x)</div>
        <svg width="100%" height="100" viewBox="0 0 320 100" style={{ overflow: 'visible' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-muted)" />
            </marker>
          </defs>

          {/* Unit Circle grid */}
          <circle cx="45" cy="50" r="28" stroke="var(--border)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
          <line x1="10" y1="50" x2="80" y2="50" stroke="var(--border)" strokeWidth="1" />
          <line x1="45" y1="15" x2="45" y2="85" stroke="var(--border)" strokeWidth="1" />

          {/* Coordinates graph system */}
          <line x1="110" y1="50" x2="315" y2="50" stroke="var(--text-muted)" strokeWidth="1" markerEnd="url(#arrow)" opacity="0.6" />
          <line x1="110" y1="12" x2="110" y2="88" stroke="var(--text-muted)" strokeWidth="1" opacity="0.6" />

          {/* Sine curve path */}
          <path ref={sinPathRef} fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" opacity="0.9" style={{ filter: 'drop-shadow(0 0 4px var(--accent-blue))' }} />
          {/* Cosine curve path */}
          <path ref={cosPathRef} fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />

          {/* Dynamic radius indicator */}
          <line ref={radiusLineRef} x1="45" y1="50" x2="45" y2="50" stroke="var(--text-primary)" strokeWidth="1.5" />
          <circle ref={circlePointRef} cx="45" cy="50" r="4" fill="var(--accent-blue)" style={{ filter: 'drop-shadow(0 0 3px var(--accent-blue))' }} />

          {/* Connection projection line */}
          <line ref={connectionLineRef} x1="45" y1="50" x2="110" y2="50" stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />

          {/* Labels & Equations */}
          <text x="308" y="44" fill="var(--text-muted)" fontSize="8">x</text>
          <text x="115" y="20" fill="var(--accent-blue)" fontSize="8">sin(x)</text>
          <text x="155" y="20" fill="var(--accent-gold)" fontSize="8">cos(x)</text>
        </svg>
      </div>

      {/* ── 3D Polyhedron / Geometry Scene ───────────── */}
      <div className="math-3d-scene">
        <div className="math-scene-glow" />
        <div className="math-grid-mesh" />
        <div className="math-3d-stage" ref={cubeRef}>
          {GLYPHS.map((g, i) => (
            <div key={g} className={`oct-face oct-face-${i + 1}`}>
              <span className="math-glyph">{g}</span>
            </div>
          ))}
        </div>

        {/* Math particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="math-particle"
            style={{
              top: p.top,
              left: ('left' in p) ? p.left : undefined,
              right: ('right' in p) ? p.right : undefined,
              animationDelay: p.delay,
              fontSize: p.size,
              color: p.color,
              textShadow: `0 0 12px ${p.color}88`,
            } as React.CSSProperties}
          >
            {p.sym}
          </div>
        ))}
      </div>
    </div>
  );
}
