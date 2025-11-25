// src/components/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Fondo from './Fondo.jsx';

export default function Landing() {
  return (
    <Fondo>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* TICKER DEFINITIVO – SIN SALTOS, SIN QUE DESAPAREZCA EL FINAL */}
        <div
          style={{
            overflow: "hidden",
            padding: "0.8rem 0",
          //  background: "rgba(0,0,0,0.6)",
            marginTop: "5rem",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "inline-block",
              paddingLeft: "100%",           // ← Empieza fuera por la derecha
              whiteSpace: "nowrap",
              animation: "ticker 25s linear infinite", // ajusta los segundos aquí si quieres más rápido/lento
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

            {/* REPETIMOS UNA VEZ MÁS PARA EL BUCLE PERFECTO */}
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

        {/* ANIMACIÓN (la pongo aquí abajo para que no se mezcle con el otro <style jsx> que ya tenías) */}
        <style jsx>{`
          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}</style>
        <section style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          position: 'relative'
        }}>
          <div style={{ maxWidth: '50rem', width: '100%', position: 'relative' }}>

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

            {/* Este bloque se ha comentado para DESHABILITAR los botones de Registrarse e Iniciar Sesión */}
            {/*
            <div style={{ margin: '3rem 0 2rem', display: 'flex', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/alta-usuario" 
                style={{ 
                  background: 'linear-gradient(90deg,#3C3C8A,#1C1C3A)', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '1.2rem 3.5rem', 
                  borderRadius: '9999px', 
                  textDecoration: 'none' 
                }}
              >
                Registrarse
              </Link>
              <Link 
                to="/iniciar-sesion" 
                style={{ 
                  background: 'linear-gradient(90deg,#3C3C8A,#1C1C3A)', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '1.2rem 3.5rem', 
                  borderRadius: '9999px', 
                  textDecoration: 'none' 
                }}
              >
                Iniciar sesión
              </Link>
            </div>
            */}

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '2.0rem', marginBottom: '3rem' }}>
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
        </section>
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