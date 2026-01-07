// src/pages/legal/TerminosUso.jsx
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext.jsx';
import { LEGAL_DATA } from '../../config/legal.js';

const TerminosUso = () => {
  const { theme } = useTheme();

  const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header básico */}
      <div style={{ backgroundColor: bgColor }}>
        <Header theme={theme} />
      </div>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        padding: '2rem 1rem',
        backgroundColor: bgColor,
        fontFamily: 'Roboto, serif',
        color: theme === 'night' ? 'rgba(255,255,255,0.9)' : '#1E2933'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: theme === 'night' ? '#7A9A7E' : '#4B744D',
            marginBottom: '2rem'
          }}>
            Términos de Uso
          </h1>

          <div style={{
            background: theme === 'night' ? 'rgba(255,255,255,0.05)' : 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: theme === 'night' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '2rem',
            border: theme === 'night' ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Aceptación de los términos
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Al acceder y utilizar EstaNoche.es, usted acepta estar sujeto a estos Términos
              de Uso, todas las leyes y regulaciones aplicables, y acepta que es responsable
              del cumplimiento de las leyes locales aplicables.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Uso del sitio web
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Usted se compromete a utilizar este sitio web solo para fines legales y de
              manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute
              del sitio web por parte de cualquier tercero.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Limitación de responsabilidad
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Proebac25 no será responsable de ningún daño que pueda surgir del uso o la
              imposibilidad de uso de los materiales en este sitio web.
            </p>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Contacto
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Si tiene alguna pregunta sobre estos Términos, contáctenos en: <strong>{LEGAL_DATA.email}</strong>.
            </p>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Contacto
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Si tiene alguna pregunta sobre estos Términos, contáctenos en: <strong>{LEGAL_DATA.email}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: bgColor }}>
        <Footer />
      </div>
    </div>
  );
};

export default TerminosUso;