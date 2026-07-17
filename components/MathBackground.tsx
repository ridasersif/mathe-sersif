'use client';

import { useEffect, useRef } from 'react';

export default function MathBackground() {
  const sine1Ref = useRef<SVGPathElement>(null);
  const sine2Ref = useRef<SVGPathElement>(null);
  const cosineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;

    function animate() {
      t += 0.015;

      const width = 1440;
      const height = 500;
      const centerY = height / 2;

      // Generate paths for background waves
      let sine1D = '';
      let sine2D = '';
      let cosineD = '';

      for (let x = 0; x <= width; x += 10) {
        // Wave 1: Sine
        const ySine1 = centerY + Math.sin(x * 0.005 + t) * 80 + Math.cos(x * 0.002 + t * 0.5) * 30;
        // Wave 2: Fast Sine
        const ySine2 = centerY + Math.sin(x * 0.008 - t * 1.2) * 50;
        // Wave 3: Cosine
        const yCosine = centerY + Math.cos(x * 0.003 + t * 0.8) * 100;

        if (x === 0) {
          sine1D += `M ${x} ${ySine1}`;
          sine2D += `M ${x} ${ySine2}`;
          cosineD += `M ${x} ${yCosine}`;
        } else {
          sine1D += ` L ${x} ${ySine1}`;
          sine2D += ` L ${x} ${ySine2}`;
          cosineD += ` L ${x} ${yCosine}`;
        }
      }

      if (sine1Ref.current) sine1Ref.current.setAttribute('d', sine1D);
      if (sine2Ref.current) sine2Ref.current.setAttribute('d', sine2D);
      if (cosineRef.current) cosineRef.current.setAttribute('d', cosineD);

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="hero-math-background">
      {/* Dynamic Animated Grid */}
      <div className="math-bg-grid" />
      
      {/* Animated Wave SVG */}
      <svg className="math-bg-waves" width="100%" height="100%" viewBox="0 0 1440 500" preserveAspectRatio="none">
        <path ref={sine1Ref} fill="none" stroke="var(--accent-blue)" strokeWidth="2" opacity="0.12" />
        <path ref={sine2Ref} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.08" />
        <path ref={cosineRef} fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.07" />
      </svg>

      {/* Floating Math Symbols */}
      <div className="math-bg-symbol symbol-1">∑</div>
      <div className="math-bg-symbol symbol-2">∫</div>
      <div className="math-bg-symbol symbol-3">π</div>
      <div className="math-bg-symbol symbol-4">√x</div>
      <div className="math-bg-symbol symbol-5">f(x) = sin(x)</div>
      <div className="math-bg-symbol symbol-6">lim (x→∞)</div>
      <div className="math-bg-symbol symbol-7">cos(θ)</div>
      <div className="math-bg-symbol symbol-8">dy/dx</div>
      <div className="math-bg-symbol symbol-9">Δ = b² - 4ac</div>
      <div className="math-bg-symbol symbol-10">λ</div>
    </div>
  );
}
