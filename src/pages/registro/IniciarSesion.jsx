// src/pages/AltaUsuario.jsx
import React from "react";
import Fondo from "../../components/Cerrado.jsx";

export default function AltaUsuario() {
  return (
    <Fondo>
      <div style={{
        maxWidth: '42rem',
        margin: '4rem auto',
        background: 'rgba(18,18,18,0.9)',
        padding: '3rem 2rem',
        borderRadius: '1.5rem',
        backdropFilter: 'blur(12px)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1.5rem',
          color: '#FFB703'
        }}>
          📝 Date de alta
        </h1>
        
        <p style={{ marginBottom: '2rem' }}>
          Te enviaremos un código de 6 dígitos por SMS para confirmar tu alta
        </p>

        <div style={{ maxWidth: '360px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Nombre completo"
            style={{
              width: '100%',
              padding: '0.9rem',
              marginBottom: '1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          
          <input 
            type="email" 
            placeholder="Email"
            style={{
              width: '100%',
              padding: '0.9rem',
              marginBottom: '1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          
          <input 
            type="tel" 
            placeholder="Teléfono móvil" 
            required
            style={{
              width: '100%',
              padding: '0.9rem',
              marginBottom: '0.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          
          <small style={{ 
            color: '#FFB703', 
            fontSize: '0.9rem', 
            marginBottom: '1.5rem', 
            display: 'block',
            textAlign: 'left'
          }}>
            * Obligatorio – aquí recibes el código SMS
          </small>
          
          <input 
            type="text" 
            placeholder="Ciudad"
            style={{
              width: '100%',
              padding: '0.9rem',
              marginBottom: '2rem',
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          <button style={{
            background: 'linear-gradient(90deg,#F72585,#FFB703)',
            padding: '0.8rem 2rem',
            border: 'none',
            borderRadius: '9999px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Cancelar
          </button>
          
          <button style={{
            background: 'linear-gradient(90deg,#F72585,#FFB703)',
            padding: '0.8rem 2rem',
            border: 'none',
            borderRadius: '9999px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Recibir código SMS
          </button>
        </div>
      </div>
    </Fondo>
  );
}