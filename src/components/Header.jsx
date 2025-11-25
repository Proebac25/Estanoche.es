// src/components/Header.jsx (Versión Responsive)
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Lógica para detectar el ancho de pantalla (responsive)
  // Se considera móvil si el ancho es menor a 640px (breakpoint sm de Tailwind)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estilos condicionales para manejar la respuesta móvil
  const headerStyle = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0,
    padding: isMobile ? '0.5rem 1rem' : '0.8rem 1.5rem', // Padding menor en móvil
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    zIndex: 50
  };

  return (
    <header style={headerStyle}>
      {/* Texto a la izquierda: Reducir fuente en móvil */}
      <div>
        <div style={{ fontWeight: 'bold', fontSize: isMobile ? '1.2rem' : '1.8rem' }}>EstaNoche.es</div>
        <div style={{ fontSize: isMobile ? '0.8rem' : '1rem', color: '#B3B3B3' }}>Tu agenda de ocio</div>
      </div>
      
      {/* Logo en el centro - posición absoluta (reducir tamaño en móvil) */}
      <img 
        src="/Assets/Icon_Zambomba.png" 
        alt="EstaNoche.es" 
        style={{ 
          height: isMobile ? '40px' : '50px', // Menos alto en móvil
          width: 'auto',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }} 
      />
      
      {/* Botón Contacto a la derecha - Mostrar solo el emoji en móvil */}
      <a 
        href="mailto:proebac25@estanoche.es"
        style={{ 
          background: 'linear-gradient(90deg,#F72585,#FFB703)', 
          color: 'white', 
          fontWeight: 'bold', 
          padding: isMobile ? '0.5rem 1rem' : '0.8rem 2rem', // Padding menor
          borderRadius: '9999px', 
          textDecoration: 'none', 
          fontSize: isMobile ? '0.8rem' : '1rem', // Fuente menor
          minWidth: isMobile ? '60px' : 'auto', // Asegurar un ancho mínimo
          textAlign: 'center'
        }}
      >
        {isMobile ? '📧' : 'Contacto'} 
      </a>
    </header>
  )
}