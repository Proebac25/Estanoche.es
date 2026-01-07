// D:\ene\src\components\Fondo.jsx
import React, { useEffect } from 'react';
import Footer from './Footer';

/**
 * Fondo.jsx - Contenedor principal que incluye Footer
 * Propósito: Proporcionar el fondo y pie de página común
 */

export default function Fondo({
  theme = 'day',
  onThemeChange,
  children = null
}) {
  // Aplicar tema al documento
  useEffect(() => {
    const cls = `site-theme-${theme}`;
    document.documentElement.classList.remove('site-theme-day', 'site-theme-night');
    document.documentElement.classList.add(cls);
    
    // Aplicar color de fondo global según tema
    if (theme === 'night') {
      document.documentElement.style.backgroundColor = '#060712';
    } else {
      document.documentElement.style.backgroundColor = '#F9F7F4';
    }
  }, [theme]);

  // Gradiente de fondo según tema
  const baseGradient = theme === 'night' 
    ? 'linear-gradient(180deg, #060712 0%, #0B0C14 100%)'
    : 'linear-gradient(135deg, #F9F7F4 0%, #F1EDE6 50%, #F9F7F4 100%)';

  return (
    <div className={`fondo fondo-theme-${theme}`} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Fondo base */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: baseGradient,
          transition: 'background 400ms ease',
          zIndex: 1
        }}
      />

      {/* Patrón sutil */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: theme === 'night' 
            ? 'radial-gradient(circle at 20% 30%, rgba(247, 37, 133, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 183, 3, 0.02) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 30%, rgba(122, 154, 126, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 183, 3, 0.03) 0%, transparent 50%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div style={{ 
        position: 'relative', 
        zIndex: 5, 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Children (contenido de cada página) */}
        <div style={{ flex: 1 }}>
          {children}
        </div>
        
        {/* Footer (incluye botón de tema) */}
        <Footer theme={theme} onThemeChange={onThemeChange} />
      </div>

      {/* Estilos globales */}
      <style>{`
        .site-theme-night { 
          color-scheme: dark; 
        }
        .site-theme-day { 
          color-scheme: light; 
        }
        
        /* Transiciones suaves para cambios de tema */
        .fondo {
          transition: background-color 400ms ease;
        }
        
        /* Mejorar rendimiento en móviles */
        @media (max-width: 768px) {
          .fondo > div:first-child {
            background-attachment: scroll !important;
          }
        }
      `}</style>
    </div>
  );
}