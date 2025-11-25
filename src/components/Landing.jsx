// src/components/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Fondo from './Fondo.jsx';

export default function Landing() {
  const handleSalir = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

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
              display: 'inline-block' 
            }}
          >
            Ver Zambombas
          </Link>

          {/* SECCIÓN "NUESTRO PROYECTO" - ESPACIO REDUCIDO */}
          <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}> {/* ← REDUCIDO de 4rem a 2rem */}
            <h2 style={{ fontSize: '2.0rem', marginBottom: '2.5rem' }}>
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

          {/* BOTÓN SALIR - ESPACIO AUMENTADO */}
          <div style={{ marginTop: '2rem' }}> {/* ← AUMENTADO de 1.5rem a 2rem (+0.5rem) */}
            <button 
              onClick={handleSalir}
              style={{ 
                background: 'linear-gradient(90deg,#FF4444,#CC0000)', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '1.2rem 3.5rem', 
                borderRadius: '9999px', 
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              Salir
            </button>
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