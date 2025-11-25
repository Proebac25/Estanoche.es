// src/components/Cerrado.jsx
import React, { useEffect, useRef } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Fondo({ children, showHeader = true, showFooter = true }) {
  const canvasRef = useRef(null);

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
    <div style={{ 
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0
    }}>
      {/* Fondo gradiente */}
      <div 
        style={{
          position: 'absolute',
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

      {/* Canvas estrellas */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: -1,
          pointerEvents: 'none'
        }} 
      />

      {/* Contenido */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1,
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {showHeader && <Header />}
        
        <main style={{ 
          flex: 1,
          paddingTop: showHeader ? '0rem' : '0',
          paddingBottom: '3rem'
        }}>
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>

      {/* Sello "Cerrado Temporalmente" */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%', 
        transform: 'translate(-50%, -50%) rotate(-15deg)',
        zIndex: 9999,
        background: 'linear-gradient(45deg, #ff0000, #cc0000)',
        color: 'white',
        padding: '3rem 4rem',
        borderRadius: '8px',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
        border: '4px solid #fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        opacity: 0.95
      }}>
        🚫<br/>CERRADO<br/>TEMPORALMENTE
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