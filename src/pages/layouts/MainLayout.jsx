// src/pages/layouts/MainLayout.jsx (CON ESTRELLITAS)
import React, { useEffect, useRef } from 'react';

export default function MainLayout({ children }) {
  const canvasRef = useRef(null);

  // LÓGICA DEL CANVAS (ESTRELLAS) - COPIADO DE LANDING
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      a: Math.random()
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFB703';
      stars.forEach(s => {
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.a = 0.5 + Math.sin(Date.now() * 0.001 + s.x) * 0.5;
      });
      requestAnimationFrame(draw);
    };
    draw();

    const resize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fondo animado IDÉNTICO A LANDING */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          background: 'linear-gradient(135deg, #3C3C8A, #1C1C3A 40%, #F72585)',
          backgroundSize: '200% 200%',
          animation: 'gradient 10s ease infinite'
        }}
        aria-hidden="true"
      />

      {/* Canvas estrellas IDÉNTICO A LANDING */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: -1, 
          opacity: 0.6 
        }} 
      />

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}