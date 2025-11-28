// src/components/Landing.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Fondo from './Fondo.jsx';

export default function Landing() {
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);

  return (
    <Fondo>
      {/* TICKER */}
      <div
        style={{
          overflow: "hidden",
          padding: "0.8rem 0",
          marginTop: "5rem",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "inline-block",
            paddingLeft: "100%",
            whiteSpace: "nowrap",
            animation: "ticker 25s linear infinite",
          }}
        >
          <span
            style={{
              padding: "0 4rem",
              fontWeight: "bold",
              color: "#FFB703",
              fontSize: "2rem",
              display: "inline-block",
            }}
          >
            ✨   ESPECIAL ZAMBOMBAS DE JEREZ   ✨
            🎹   ¿PROMUEVES O PROTAGONIZAS EVENTOS? 🔊 ¿NO ESTÁ EL TUYO? 📧 CONTÁCTANOS     🚀   NOS LANZAMOS EN 2026   🚀
            ✨   ESPECIAL ZAMBOMBAS DE JEREZ   ✨
            🎹   ¿PROMUEVES O PROTAGONIZAS EVENTOS? 🔊 ¿NO ESTÁ EL TUYO? 📧 CONTÁCTANOS     🚀   NOS LANZAMOS EN 2026   🚀
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>

          <span
            style={{
              padding: "0 4rem",
              fontWeight: "bold",
              color: "#FFB703",
              fontSize: "2rem",
              display: "inline-block",
            }}
          >
            🏃🏻‍♂️ EN BREVE ✨ ESPECIAL ZAMBOMBAS DE JEREZ ✨
            🎹 ¿PROMUEVES O PROTAGONIZAS EVENTOS? 🔊 ¿NO ESTÁ EL TUYO? 📧 CONTÁCTANOS 🚀 NOS LANZAMOS EN 2026 🚀
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem 1rem 0.5rem 1rem',
      }}>
        <div style={{ maxWidth: '50rem', width: '100%', margin: '0 auto' }}>

          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
            <img src="/Assets/Icon_Zambomba.png" alt="Zambomba" style={{ width: '1.8em', height: '1.8em', verticalAlign: 'middle' }} />
            <img src="/Assets/SolyLuna2.png" alt="SOlyLuna" style={{ width: '1.8em', height: '1.8em', verticalAlign: 'middle' }} />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
            Descubre el ocio<br/>
            <span style={{ background: 'linear-gradient(90deg,#FFB703,#F72585)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>de tu ciudad</span>
          </h1>

          <p style={{ fontSize: '1.7rem', opacity: 0.9, marginBottom: '3rem' }}>
            Conciertos, eventos y planes únicos.
          </p>

          <Link 
            to="/agenda" 
            style={{ 
              background: 'linear-gradient(90deg,#F72585,#FFB703)', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '1.5rem 4.5rem', 
              borderRadius: '9999px', 
              textDecoration: 'none', 
              fontSize: '1.4rem', 
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}
          >
            Ver Zambombas
          </Link>

          {/* BOTÓN DE INSTRUCCIONES PWA */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => setShowPWAInstructions(!showPWAInstructions)}
              style={{
                background: 'transparent',
                color: '#FFB703',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                borderRadius: '9999px',
                border: '2px solid #FFB703',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FFB703';
                e.target.style.color = '#3C3C8A';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#FFB703';
              }}
            >
              📱 ¿Cómo instalar la app?
            </button>

            {/* DESPLEGABLE CON INSTRUCCIONES */}
            {showPWAInstructions && (
              <div style={{
                background: 'rgba(60, 60, 138, 0.95)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '1rem',
                textAlign: 'left',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid #FFB703',
                position: 'relative'
              }}>
                {/* BOTÓN DE CERRAR */}
                <button
                  onClick={() => setShowPWAInstructions(false)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: '#F72585',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>

                <h3 style={{ 
                  color: '#FFB703', 
                  marginBottom: '1rem',
                  fontSize: '1.3rem',
                  textAlign: 'center',
                  marginTop: '0.5rem'
                }}>
                  Instala EstaNoche.es en tu móvil
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#FFB703' }}>📱 Chrome, Firefox... (Android):</strong>
                  <ol style={{ 
                    paddingLeft: '1.5rem', 
                    margin: '0.5rem 0',
                    color: 'white'
                  }}>
                    <li>Abre el menú (3 puntos)</li>
                    <li>Selecciona "Añadir a la pantalla de inicio"</li>
                    <li>Confirma la instalación.</li>
                  </ol>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#FFB703' }}>🍎 Safari (iPhone):</strong>
                  <ol style={{ 
                    paddingLeft: '1.5rem', 
                    margin: '0.5rem 0',
                    color: 'white'
                  }}>
                    <li>Toca el icono de compartir (cuadrado con flecha)</li>
                    <li>Desplaza y selecciona "Añadir a pantalla de inicio"</li>
                    <li>Pulsa "Añadir"</li>
                  </ol>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#FFB703' }}>⚡ Samsung Internet:</strong>
                  <ol style={{ 
                    paddingLeft: '1.5rem', 
                    margin: '0.5rem 0',
                    color: 'white'
                  }}>
                    <li>Abre el menú (3 líneas)</li>
                    <li>Selecciona "Añadir página a"</li>
                    <li>Elige "Pantalla de inicio"</li>
                  </ol>
                </div>

                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#FFB703', 
                  textAlign: 'center',
                  marginBottom: '0',
                  fontStyle: 'italic'
                }}>
                  ¡Tendrás acceso rápido como una app nativa!
                </p>
              </div>
            )}
          </div>

          {/* SECCIÓN "NUESTRO PROYECTO" */}
          <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.0rem', marginBottom: '2.5rem', color: 'white' }}>
              Descubre un poco más
            </h2>
            <Link 
              to="/sobre" 
              style={{ 
                background: 'linear-gradient(90deg,#F72585,#FFB703)', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '1.2rem 3.5rem', 
                borderRadius: '9999px', 
                textDecoration: 'none', 
                fontSize: '1.2rem' 
              }}
            >
              Nuestro proyecto
            </Link>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Fondo>
  );
}