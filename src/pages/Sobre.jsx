// src/pages/Sobre.jsx 
import React from 'react';
import { Link } from 'react-router-dom';
import Fondo from '../components/Fondo.jsx'; 

const strongStyle = { color: '#d4a15a' };

export default function Sobre() {
  return (
    <Fondo>    
      <div style={{
        minHeight: '100vh',
        paddingTop: '4rem',
        paddingBottom: '3rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: 768,
          margin: '2.4rem auto 0',
          textAlign: 'left',
          background: 'rgba(18,18,18,0.85)',
          padding: '2.5rem 2rem',
          borderRadius: '1rem',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          position: 'relative',
          zIndex: 10000 // ← ALTO zIndex
        }}>
          <h1 style={{ color: '#FFB703', marginTop: '2.0rem', fontSize: '2.5rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 900 }}>
            La plataforma
          </h1>

          <div style={{ fontSize: '1.08rem', lineHeight: 1.8, textAlign: 'justify' }}>
            <p>
              EstaNoche.es es una plataforma independiente que conecta a personas con los mejores planes de su ciudad. Eventos creados por locales, artistas y promotores que apuestan por un ocio diferente.
            </p>

            <p>
              Una <strong style={strongStyle}>PWA innovadora</strong> dedicada a centralizar y facilitar el descubrimiento de opciones de ocio nocturno y cultural, lanzada como una herramienta <strong style={strongStyle}>gratuita y accesible</strong>.
            </p>

            <p>
              Su propósito principal es actuar como una <strong style={strongStyle}>agenda unificada de eventos</strong>, eliminando la necesidad de navegar por múltiples apps o sitios dispersos.
            </p>

            <p>
              Dirigida a todos los públicos interesados en planes locales –desde conciertos y fiestas hasta actividades culturales o deportivas–, promueve el entretenimiento sin barreras: <strong style={strongStyle}>no requiere registro, descargas ni pagos</strong> para explorar contenido.
            </p>

            <p>
              Por su desarrollo permite una experiencia fluida en móviles, tablet y desktops, con instalación opcional para acceso offline.
            </p>

            <h2 style={{ color: '#FFB703', marginTop: '0.5rem', fontSize: '1.5rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 900 }}>
              Características clave
            </h2>
            <ul style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
              <li>Agenda de eventos con todo tipo de ocio</li>
              <li>Búsquedas selectivas con filtros</li>
              <li>Formulario gratuito para creadores</li>
              <li>Acceso inmediato sin redes dispersas</li>
            </ul>
            
            <h2 style={{ color: '#FFB703', marginTop: '0.5rem', fontSize: '1.5rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 900 }}>
              Instálala en tu dispositivo
            </h2>

            <p>Ábrela en el navegador → toca los tres puntos → "Añadir a pantalla de inicio".</p>

            <div style={{ display: 'flex', justifyContent:'center', gap: 12 , marginTop: '1.4rem', flexWrap: 'wrap' }}>
              <Link 
                to="/alta-usuario" 
                style={{
                  background: 'linear-gradient(90deg,#3C3C8A,#1C1C3A)',
                  color: '#fff',
                  padding: '0.9rem 1.6rem',
                  borderRadius: 999,
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 10001
                }}
              >
                📝 Registrarte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fondo>
  );
}