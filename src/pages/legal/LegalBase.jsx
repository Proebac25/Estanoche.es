// src/pages/legal/LegalBase.jsx
import React from 'react';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';

export default function LegalBase({ title, children }) {
  return (
    <main style={{
      minHeight: '100vh',
      paddingTop: '6.4rem',
      paddingBottom: '3rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      background: 'linear-gradient(135deg, #3C3C8A 0%, #1C1C3A 40%, #F72585 100%)',
      backgroundSize: '200% 200%',
      animation: 'legalGradient 12s ease infinite',
      fontFamily: "'Roboto', sans-serif",
      color: '#fff'
    }}>
      <Header />

      <div style={{
        maxWidth: 920,
        margin: '2rem auto',
        background: 'rgba(0,0,0,0.76)',
        padding: '2.4rem',
        borderRadius: '1rem',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.6)'
      }}>
        <h1 style={{ marginBottom: '1.2rem', color: '#FFB703', fontSize: '2rem' }}>{title}</h1>

        <div style={{ color: '#e6e6e6', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes legalGradient {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </main>
  );
}
