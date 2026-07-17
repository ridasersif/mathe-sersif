'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveMathCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, rx: 0.5, ry: 0.5 });

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / width;
      const my = (e.clientY - rect.top) / height;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      // Target rotation angles based on mouse
      mouseRef.current.rx = (mx - 0.5) * 1.5;
      mouseRef.current.ry = (my - 0.5) * 1.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D rotation angles
    let angleX = 0.6;
    let angleY = 0.6;
    let time = 0;

    // Lorenz Attractor variables
    let xLorenz = 0.1, yLorenz = 0, zLorenz = 0;
    const aLorenz = 10, bLorenz = 28, cLorenz = 8 / 3;
    const lorenzPoints: { x: number; y: number; z: number }[] = [];

    // Helper for 3D projection
    // Center of projection is (width/2, height/2)
    const project = (x3d: number, y3d: number, z3d: number) => {
      // Apply rotations
      // Rotate Y (yaw)
      let x = x3d * Math.cos(angleY) - z3d * Math.sin(angleY);
      let z = x3d * Math.sin(angleY) + z3d * Math.cos(angleY);
      
      // Rotate X (pitch)
      let y = y3d * Math.cos(angleX) - z * Math.sin(angleX);
      z = y3d * Math.sin(angleX) + z * Math.cos(angleX);

      // Perspective scale factor
      const fov = 400;
      const scale = fov / (fov + z);
      const projX = width / 2 + x * scale;
      const projY = height / 2 + y * scale;

      return { x: projX, y: projY, scale, visible: z > -fov };
    };

    // Math surface equations
    // Renders a dynamic 3D Ripple surface: z = sin(sqrt(x^2+y^2) - t)
    const getSurfacePoint = (u: number, v: number, t: number) => {
      // u, v run from -10 to 10
      const r = Math.sqrt(u * u + v * v) + 0.001;
      const z = Math.sin(r - t * 4) * 2.5 * (Math.sin(t) * 0.3 + 0.7);
      return { x: u * 12, y: z * 10, z: v * 12 };
    };

    function animate() {
      if (!ctx) return;
      time += 0.015;

      // Smooth interpolation for mouse rotation
      angleX += (mouseRef.current.ry - angleX) * 0.05;
      angleY += (mouseRef.current.rx - angleY) * 0.05;

      // Clear with subtle dark blue space gradient
      const isDark = document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      // 1. Draw coordinate axes and grid lines
      ctx.strokeStyle = isDark ? 'rgba(79, 142, 247, 0.06)' : 'rgba(79, 142, 247, 0.04)';
      ctx.lineWidth = 1;

      // Draw horizontal reference plane (XZ plane grid)
      const gridSize = 10;
      const gridSpacing = 20;
      for (let i = -gridSize; i <= gridSize; i++) {
        // Line along Z axis
        ctx.beginPath();
        let p1 = project(i * gridSpacing, 0, -gridSize * gridSpacing);
        let p2 = project(i * gridSpacing, 0, gridSize * gridSpacing);
        if (p1.visible && p2.visible) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Line along X axis
        ctx.beginPath();
        p1 = project(-gridSize * gridSpacing, 0, i * gridSpacing);
        p2 = project(gridSize * gridSpacing, 0, i * gridSpacing);
        if (p1.visible && p2.visible) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw Main Axes X, Y, Z
      const axisLen = 220;
      const origin = project(0, 0, 0);
      const xAxis = project(axisLen, 0, 0);
      const yAxis = project(0, -axisLen, 0); // Y goes up in math, down in screen
      const zAxis = project(0, 0, axisLen);

      const drawAxis = (toPoint: any, label: string, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.stroke();
        
        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.fillText(label, toPoint.x + 5, toPoint.y + 5);
      };

      if (origin.visible) {
        drawAxis(xAxis, 'X (Re)', isDark ? 'rgba(79, 142, 247, 0.4)' : 'rgba(79, 142, 247, 0.25)');
        drawAxis(yAxis, 'Y (Im)', isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(167, 139, 250, 0.25)');
        drawAxis(zAxis, 'Z', isDark ? 'rgba(201, 168, 76, 0.4)' : 'rgba(201, 168, 76, 0.25)');
      }

      // 2. Draw 3D Wave Ripple Surface (Mesh)
      ctx.lineWidth = 1.2;
      const meshResolution = 18;
      const bounds = 8;
      
      // Draw wires along U direction
      for (let u = -bounds; u <= bounds; u += bounds / meshResolution) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${210 + Math.sin(time) * 30}, 85%, 60%, 0.15)`;
        let first = true;
        for (let v = -bounds; v <= bounds; v += 0.5) {
          const pt = getSurfacePoint(u, v, time);
          const proj = project(pt.x, pt.y, pt.z);
          if (proj.visible) {
            if (first) {
              ctx.moveTo(proj.x, proj.y);
              first = false;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
      }

      // Draw wires along V direction
      for (let v = -bounds; v <= bounds; v += bounds / meshResolution) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${260 + Math.cos(time) * 30}, 85%, 60%, 0.12)`;
        let first = true;
        for (let u = -bounds; u <= bounds; u += 0.5) {
          const pt = getSurfacePoint(u, v, time);
          const proj = project(pt.x, pt.y, pt.z);
          if (proj.visible) {
            if (first) {
              ctx.moveTo(proj.x, proj.y);
              first = false;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
      }

      // 3. Compute and Draw Lorenz Chaotic Attractor Orbit
      const dt = 0.01;
      const dx = aLorenz * (yLorenz - xLorenz) * dt;
      const dy = (xLorenz * (bLorenz - zLorenz) - yLorenz) * dt;
      const dz = (xLorenz * yLorenz - cLorenz * zLorenz) * dt;
      xLorenz += dx;
      yLorenz += dy;
      zLorenz += dz;
      
      // Store trace (shift system centered around z=25)
      lorenzPoints.push({ x: xLorenz * 4, y: (zLorenz - 25) * 4, z: yLorenz * 4 });
      if (lorenzPoints.length > 180) lorenzPoints.shift();

      if (lorenzPoints.length > 1) {
        ctx.lineWidth = 2.5;
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(201, 168, 76, 0.6)';
        ctx.beginPath();
        
        const startProj = project(lorenzPoints[0].x, lorenzPoints[0].y, lorenzPoints[0].z);
        ctx.moveTo(startProj.x, startProj.y);
        
        for (let i = 1; i < lorenzPoints.length; i++) {
          const ptProj = project(lorenzPoints[i].x, lorenzPoints[i].y, lorenzPoints[i].z);
          if (ptProj.visible) {
            const grad = ctx.createLinearGradient(
              lorenzPoints[i - 1].x, lorenzPoints[i - 1].y,
              lorenzPoints[i].x, lorenzPoints[i].y
            );
            ctx.strokeStyle = `hsla(45, 100%, 55%, ${i / lorenzPoints.length * 0.85})`;
            ctx.lineTo(ptProj.x, ptProj.y);
          }
        }
        ctx.stroke();
        // Reset shadow
        ctx.shadowBlur = 0;
      }

      // 4. Mathematical Equation Particle Stream
      // Draw floating geometric notes orbiting
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
      ctx.font = 'italic 11px Georgia';
      const equations = [
        { text: 'e^(iπ) + 1 = 0', x: 120 * Math.sin(time * 0.5), y: -100 + 15 * Math.sin(time), z: 120 * Math.cos(time * 0.5) },
        { text: '∫ x² dx = x³/3', x: 140 * Math.sin(time * 0.4 + 2), y: 80 + 10 * Math.cos(time * 0.8), z: 140 * Math.cos(time * 0.4 + 2) },
        { text: '∇ × E = -∂B/∂t', x: 160 * Math.sin(time * 0.3 + 4), y: -20 + 20 * Math.sin(time * 0.5), z: 160 * Math.cos(time * 0.3 + 4) },
        { text: 'iℏ ∂/∂t |ψ⟩ = Ĥ|ψ⟩', x: 130 * Math.sin(time * 0.6 + 1), y: 120, z: 130 * Math.cos(time * 0.6 + 1) }
      ];

      equations.forEach(eq => {
        const proj = project(eq.x, eq.y, eq.z);
        if (proj.visible) {
          ctx.font = `${11 * proj.scale}px Georgia`;
          ctx.fillStyle = `hsla(${210 + proj.scale * 30}, 80%, 65%, ${proj.scale * 0.7})`;
          ctx.fillText(eq.text, proj.x, proj.y);
        }
      });

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-math-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'normal'
      }}
    />
  );
}
