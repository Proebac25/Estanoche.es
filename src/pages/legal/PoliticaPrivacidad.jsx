// src/pages/legal/PoliticaPrivacidad.jsx
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext.jsx';
import { LEGAL_DATA } from '../../config/legal.js';

const PoliticaPrivacidad = () => {
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
            Política de Privacidad
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
              Responsable del tratamiento
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Proebac25 es el responsable del tratamiento de los datos personales recogidos
              a través de este sitio web, en cumplimiento del Reglamento General de
              Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Datos que recopilamos
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Podemos recopilar información personal que usted nos proporcione directamente,
              como nombre, dirección de correo electrónico, y datos de uso del sitio web.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Finalidad del tratamiento
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Sus datos personales serán tratados para gestionar su cuenta, mejorar nuestros
              servicios, y enviarle información relevante sobre nuestros productos y servicios.
            </p>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Sus derechos
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Tiene derecho a acceder, rectificar y suprimir sus datos. Para ejercer estos derechos,
              contacte con nosotros en: <strong>{LEGAL_DATA.email}</strong>.
            </p>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              Sus derechos
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Tiene derecho a acceder, rectificar y suprimir sus datos. Para ejercer estos derechos,
              contacte con nosotros en: <strong>{LEGAL_DATA.email}</strong>.
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

export default PoliticaPrivacidad;