// src/pages/legal/AvisoLegal.jsx
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext.jsx';
import { LEGAL_DATA } from '../../config/legal.js';

const AvisoLegal = () => {
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
            Aviso Legal
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
              1. Información General
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              En cumplimiento con el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios
              de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se informa que
              el titular del sitio web es Proebac25.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              2. Condiciones de Uso
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              El acceso y uso de esta página web le otorga la condición de usuario e implica la
              aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.
            </p>

            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              3. Propiedad Intelectual e Industrial
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos,
              gráficos, etc., son propiedad de Proebac25 o de terceros que han autorizado su uso.
            </p>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              4. Contacto
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Para cualquier consulta relacionada con este aviso legal, puede contactarnos en: <br />
              <strong>Email:</strong> {LEGAL_DATA.email}
            </p>
            <h2 style={{ color: theme === 'night' ? '#7A9A7E' : '#4B744D', marginBottom: '1rem' }}>
              4. Contacto
            </h2>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Para cualquier consulta relacionada con este aviso legal, puede contactarnos en: <br />
              <strong>Email:</strong> {LEGAL_DATA.email}
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

export default AvisoLegal;