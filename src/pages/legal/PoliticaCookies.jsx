// src/pages/legal/PoliticaCookies.jsx
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext.jsx';
import { LEGAL_DATA } from '../../config/legal.js';

const PoliticaCookies = () => {
  const { theme } = useTheme();

  const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ backgroundColor: bgColor }}>
        <Header theme={theme} />
      </div>

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
            Política de Cookies
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
              ¿Qué son las cookies?
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en su
              dispositivo para mejorar la experiencia de usuario, recordar sus preferencias y
              analizar el tráfico del sitio.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Tipos de cookies que utilizamos
            </h2>
            <ul style={{ lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio.</li>
              <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo interactúan los usuarios.</li>
              <li><strong>Cookies de funcionalidad:</strong> Recuerdan sus preferencias y elecciones.</li>
            </ul>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Cómo gestionar las cookies
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Puede gestionar o deshabilitar las cookies a través de la configuración de su
              navegador. Tenga en cuenta que deshabilitar ciertas cookies puede afectar la
              funcionalidad del sitio web.
            </p>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Si tiene dudas sobre nuestra política de cookies, puede contactarnos en: <strong>{LEGAL_DATA.email}</strong>.
            </p>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Si tiene dudas sobre nuestra política de cookies, puede contactarnos en: <strong>{LEGAL_DATA.email}</strong>.
            </p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: bgColor }}>
        <Footer />
      </div>
    </div>
  );
};

export default PoliticaCookies;