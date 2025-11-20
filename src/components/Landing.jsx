// src/components/Landing.jsx

import React from 'react'; 

export default function Landing() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px',
      color: '#FFFFFF', 
      backgroundColor: '#1E1E1E', // Fondo oscuro simple
      minHeight: '100vh',
      fontSize: '3rem'
    }}>
      <h1>¡HOLA! Landing de Prueba Simple</h1>
      <p style={{fontSize: '1.5rem'}}>Si ves este mensaje, React se inicializa correctamente.</p>
    </div>
  );
}