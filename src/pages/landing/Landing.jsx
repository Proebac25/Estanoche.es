// src/pages/landing/landing.jsx
import React, { useEffect } from 'react';
import HeaderLand from '../../components/HeaderLand';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx'; // <-- AÑADIR IMPORT

export default function Landing() {
  const { theme } = useTheme(); // <-- USAR CONTEXTO (solo lectura)
  const navigate = useNavigate();

  const goToAgenda = () => {
    navigate('/agenda');
  };

  const goToSobre = () => {
    navigate('/sobre');
  };

  // SOLO aplicar el tema (ya no gestionarlo, solo leerlo)
  useEffect(() => {
    const cls = `site-theme-${theme}`;
    document.documentElement.classList.remove('site-theme-day', 'site-theme-night');
    document.documentElement.classList.add(cls);
    
    // Mismo color de fondo para todo
    const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
  }, [theme]); // <-- Solo se ejecuta cuando cambia el tema del contexto

  // ELIMINAR: el bloque de código que prevenía scroll
  // Dejar que la página sea naturalmente responsiva

  const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header - mismo color de fondo */}
      <div style={{ backgroundColor: bgColor }}>
        <HeaderLand theme={theme} /> {/* Solo pasa el tema para que HeaderLand lo use visualmente */}
      </div>
      
      {/* Contenido principal - AHORA CON ALTURA FLEXIBLE */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        position: 'relative',
        padding: '1rem 0' /* Añadir padding vertical para espacio */
      }}>
        {/* Patrón sutil (opcional) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: theme === 'night' 
            ? 'radial-gradient(circle at 20% 30%, rgba(247, 37, 133, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 183, 3, 0.02) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 30%, rgba(122, 154, 126, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 183, 3, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        {/* Contenedor flexible que se adapta */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '500px',
          minHeight: '400px', /* Mínimo para pantallas pequeñas */
          padding: '1rem',
          flex: 1, /* Ocupa espacio disponible */
          gap: '1rem' /* Espacio uniforme entre elementos */
        }}>
          
          {/* 1. Cajón con "AGENDA DE OCIO" */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <button
              onClick={goToAgenda}
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--mo-spot), var(--mo-amber))',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 300ms ease',
                padding: '0',
                boxShadow: '0 12px 40px rgba(247, 37, 133, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 16px 48px rgba(247, 37, 133, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 12px 40px rgba(247, 37, 133, 0.25)';
              }}
              aria-label="Ir a la Agenda de Ocio"
            >
              <div style={{
                textAlign: 'center',
                padding: '16px'
              }}>
                <div style={{ 
                  fontFamily: 'Roboto, serif', 
                  fontWeight: 800, 
                  fontSize: '22px', 
                  lineHeight: 1.1,
                  letterSpacing: '0.5px',
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  Vamos a la <br /> AGENDA
                </div>
              </div>
            </button>
          </div>

         {/* 2. CTA "Sin necesidad..." - AHORA SEGUNDO */}
<div style={{
  width: '100%',
  padding: '1.5rem 1rem',
  borderRadius: '16px',
  background: theme === 'day' 
    ? '#E2E8F0' // Gris medio claro para día
    : '#E2E8F0', // Gris un poco más oscuro para noche
  backdropFilter: 'blur(12px)',
  border: theme === 'day' 
    ? '1px solid rgba(203, 213, 224, 0.3)' 
    : '1px solid rgba(74, 85, 104, 0.4)',
  boxShadow: theme === 'day' 
    ? '0 10px 36px rgba(203, 213, 224, 0.25)' 
    : '0 10px 36px rgba(0, 0, 0, 0.4)',
  flexShrink: 0
}}>
  <div style={{ 
    margin: 0, 
    color: '#4B744D', // Amarillo neón en ambos modos
    fontSize: '1.1rem',
    fontWeight: 600,
    letterSpacing: '0.3px',
    textAlign: 'center',
    lineHeight: 1.4,
    
  }}>
    Sin necesidad de registro o instalación
  </div>
</div>

          {/* 3. Raya de colores - AHORA TERCERO */}
          <div style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            flexShrink: 0
          }}>
            <div style={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, var(--mo-spot), var(--mo-amber))',
              borderRadius: '2px'
            }} />
          </div>

          {/* 4. Botón "Conoce nuestra propuesta" - AHORA CUARTO */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <button
              onClick={goToSobre}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                background: theme === 'day' 
                  ? 'linear-gradient(90deg, var(--mo-olive), rgba(122, 154, 126, 0.8))' 
                  : 'linear-gradient(90deg, var(--mo-olive), rgba(122, 154, 126, 0.8))',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 300ms ease',
                color: '#FFFFFF',
                fontFamily: 'Roboto, serif',
                fontWeight: 600,
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
                boxShadow: '0 6px 20px rgba(75, 116, 77, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(75, 116, 77, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(75, 116, 77, 0.3)';
              }}
              aria-label="Conoce nuestra propuesta"
            >
              Conoce nuestra propuesta
            </button>
          </div>
        </div>
      </div>

      {/* Footer - ya no necesita props, usa contexto internamente */}
      <div style={{ backgroundColor: bgColor }}>
        <Footer /> {/* <-- SIN PROPS */}
      </div>
    </div>
  );
}