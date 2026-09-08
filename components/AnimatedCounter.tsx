'use client';

import { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1200 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrame: number;
    let observer: IntersectionObserver;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animationFrame = requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (observer) observer.disconnect();
    };
  }, [value, duration]);

  return <span ref={elementRef}>{count}</span>;
}
