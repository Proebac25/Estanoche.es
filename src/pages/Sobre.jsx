import React from 'react';
// 🔑 Importación Corregida: Va un nivel arriba (..) para entrar a components/
import Footer from '../components/Footer.jsx'; 

export default function Sobre() {
  return (
    <>
      {/* 🔑 CONTENEDOR PRINCIPAL */}
      <div style={{ padding: '6rem 1rem 3rem', minHeight: '100vh', color: 'white' }}>
        
        {/* CABECERA SIMPLE: Solo enlace de regreso */}
        <header style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            <a href="/" style={{ fontWeight: 'bold', fontSize: '1.4rem', textDecoration: 'none', color: 'inherit' }}>
              ← Volver a Inicio
            </a>
        </header>

        <div style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '2rem', borderRadius: '10px' }}>
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 900, 
            lineHeight: 1.1, 
            marginBottom: '2rem',
            background: 'linear-gradient(90deg,#FFB703,#F72585)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Sobre EstaNoche.es
          </h1>

          {/* CONTENIDO MIGRADO */}
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            EstaNoche.es es una <strong>PWA innovadora</strong> dedicada a centralizar y facilitar el descubrimiento de opciones de ocio nocturno y cultural, lanzada como una herramienta <strong>gratuita y accesible.</strong>
          </p>
          {/* ... (Resto del contenido del párrafo) ... */}
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Por su desarrollo permite una experiencia fluida en móviles, tablet y desktops, con instalación opcional para acceso offline.
          </p>

          <h2 style={{ color: '#FFB703', marginTop: '2rem', marginBottom: '1rem' }}>Características clave</h2>
          {/* ... (Lista de características) ... */}
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/alta-usuario" style={{ background: 'linear-gradient(90deg,#F72585,#FFB703)', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '1.1rem', marginRight: '1rem' }}>
              📝 Date de alta
            </a>
            <a href="/" style={{ background: 'linear-gradient(90deg,#3C3C8A,#1C1C3A)', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Volver al inicio
            </a>
          </div>

        </div>
      </div>
      
      {/* 🔑 PIE DE PÁGINA: Llamado al componente Footer */}
      <Footer /> 
    </>
  )
}