'use client';

import { useEffect, useRef } from 'react';

export default function GlowingMathSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic particles on a 3D Sphere
    const particleCount = 70;
    const particles: { theta: number; phi: number; text: string; color: string }[] = [];
    const symbols = ['∑', '∫', 'π', '∞', '∇', 'Δ', 'θ', 'λ', 'φ', 'μ', '√', 'f'];
    const colors = ['rgba(79, 142, 247, 0.45)', 'rgba(167, 139, 250, 0.45)', 'rgba(201, 168, 76, 0.45)', 'rgba(56, 189, 248, 0.45)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        // Uniform spherical distribution
        theta: Math.acos(Math.random() * 2 - 1),
        phi: Math.random() * Math.PI * 2,
        text: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let rotY = 0;
    let rotX = 0.2;

    function animate() {
      if (!ctx) return;
      rotY += 0.006;
      rotX = 0.2 + Math.sin(rotY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project and sort particles by depth Z for correct rendering order (back-to-front)
      const projected = particles.map(p => {
        // Spherical to Cartesian coordinates
        let x = radius * Math.sin(p.theta) * Math.cos(p.phi);
        let y = radius * Math.sin(p.theta) * Math.sin(p.phi);
        let z = radius * Math.cos(p.theta);

        // Rotate on Y
        let rx1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        let rz1 = x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotate on X
        let ry2 = y * Math.cos(rotX) - rz1 * Math.sin(rotX);
        let rz2 = y * Math.sin(rotX) + rz1 * Math.cos(rotX);

        // Perspective projection
        const fov = 350;
        const scale = fov / (fov + rz2);
        const projX = centerX + rx1 * scale;
        const projY = centerY + ry2 * scale;

        return {
          x: projX,
          y: projY,
          z: rz2,
          scale,
          text: p.text,
          color: p.color
        };
      });

      // Sort by depth
      projected.sort((a, b) => b.z - a.z);

      // Draw wireframe coordinate lat/long rings
      ctx.lineWidth = 0.6;
      const ringCount = 5;
      for (let r = 0; r < ringCount; r++) {
        // Draw latitude circles
        const latTheta = (Math.PI / (ringCount + 1)) * (r + 1);
        ctx.beginPath();
        ctx.strokeStyle = document.documentElement.classList.contains('dark')
          ? 'rgba(79, 142, 247, 0.04)'
          : 'rgba(79, 142, 247, 0.02)';
        
        let first = true;
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const x = radius * Math.sin(latTheta) * Math.cos(a);
          const y = radius * Math.sin(latTheta) * Math.sin(a);
          const z = radius * Math.cos(latTheta);

          let rx1 = x * Math.cos(rotY) - z * Math.sin(rotY);
          let rz1 = x * Math.sin(rotY) + z * Math.cos(rotY);
          let ry2 = y * Math.cos(rotX) - rz1 * Math.sin(rotX);
          let rz2 = y * Math.sin(rotX) + rz1 * Math.cos(rotX);

          const scale = 350 / (350 + rz2);
          const projX = centerX + rx1 * scale;
          const projY = centerY + ry2 * scale;

          if (first) {
            ctx.moveTo(projX, projY);
            first = false;
          } else {
            ctx.lineTo(projX, projY);
          }
        }
        ctx.stroke();
      }

      // Draw equations/particles
      projected.forEach(p => {
        const opacity = (p.z + radius) / (radius * 2); // deeper = less visible
        ctx.font = `bold ${Math.floor(10 + p.scale * 12)}px 'Playfair Display'`;
        
        // Draw glowing shadow for particles in the front
        if (p.z < 0) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = p.color.replace('0.45', (opacity * 0.45).toString());
        ctx.fillText(p.text, p.x, p.y);
      });
      ctx.shadowBlur = 0;

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="glowing-math-sphere"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
