// src/components/Landing.jsx

import React from 'react'; 

// Nota: No se importa 'useEffect', 'useRef', ni otros componentes como Footer.

export default function Landing() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px',
      color: '#FFFFFF', // Blanco
      backgroundColor: '#1E1E1E', // Un fondo oscuro simple
      minHeight: '100vh',
      fontSize: '3rem'
    }}>
      <h1>¡HOLA! Landing de Prueba Simple</h1>
      <p>Si ves este mensaje, React está funcionando correctamente.</p>
    </div>
  );
}