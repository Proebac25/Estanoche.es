// src/components/PlanoFondo.jsx (Nuevo Archivo - Versión Limpia)

import React, { useEffect, useRef } from 'react';

// Se eliminan los imports de Header y Footer

export default function PlanoFondo({ children }) { // Simplificamos los props, ya no necesitamos showHeader/showFooter
  const canvasRef = useRef(null);

  // 1. LÓGICA DE LA ANIMACIÓN DE ESTRELLAS (Se mantiene igual)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setupCanvas();

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
      setupCanvas();
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    // 2. CONTENEDOR PRINCIPAL: Asegura cobertura total de la pantalla
    <div style={{ 
      position: 'relative',
      width: '100vw',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      background: 'transparent'
    }}>
      
      {/* Fondo gradiente (FIJO - Z-INDEX -2) */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          background: 'linear-gradient(135deg, #3C3C8A, #1C1C3A 40%, #F72585)',
          backgroundSize: '200% 200%',
          animation: 'gradient 10s ease infinite'
        }}
        aria-hidden="true"
      />

      {/* Canvas estrellas (FIJO - Z-INDEX -1) */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: -1,
          pointerEvents: 'none'
        }} 
      />

      {/* 3. CONTENIDO (children) - EL MAIN LIMPIO */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, // Mantiene el contenido por encima del fondo
        width: '100%', // Usamos 100% en lugar de 100vw para evitar problemas de scrollbar
        minHeight: '100vh',
        // ELIMINAMOS FLEX Y HEADER/FOOTER
      }}>
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