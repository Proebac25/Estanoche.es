// src/components/Footer.jsx - VERSIÓN CON CONTEXTO
import React, { useState, useEffect, useRef } from 'react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx'; // <-- IMPORTAR CONTEXTO

/**
 * Footer.jsx - Pie de página TRANSPARENTE
 * - Completamente transparente
 * - Menú desplegable funcional con enlaces legales
 * - Verde oliva (#4B744D) para menús
 * - AHORA usa ThemeContext para persistencia
 */

const Footer = () => { // <-- ELIMINAR PARÁMETROS theme y onThemeChange
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  
  const { theme, toggleTheme } = useTheme(); // <-- OBTENER DEL CONTEXTO

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Colores de iconos según tema
  const getIconColor = () => {
    return theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#1E2933';
  };

  const iconColor = getIconColor();
  
  // Colores fijos para menús (verde oliva y blanco bold)
  const menuColors = {
    bg: '#4B744D', // --mo-olive
    text: '#FFFFFF', // Blanco
    hover: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: '0 12px 40px rgba(75, 116, 77, 0.3)'
  };

  return (
    <footer
      style={{
        background: 'transparent',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 80,
        marginTop: 'auto',
        padding: '20px 0'
      }}
    >
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Left: Botón de tema (luna/sol) */}
        <button
          onClick={toggleTheme} // <-- USAR toggleTheme DEL CONTEXTO
          style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: iconColor,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 120ms ease',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          aria-label={theme === 'day' ? 'Cambiar a modo noche' : 'Cambiar a modo día'}
        >
          {theme === 'day' ? <FaMoon size={18} /> : <FaSun size={18} />}
        </button>

        {/* Center: Copyright */}
        <div style={{ 
          color: iconColor,
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'Roboto, serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          © Proebac25. 2025
        </div>

        {/* Right: Botón de menú hamburguesa con desplegable LEGAL */}
        <div style={{ position: 'relative' }}>
          <button
            ref={menuButtonRef}
            aria-label={menuOpen ? 'Cerrar menú legal' : 'Abrir menú legal'}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            style={{
              width: 44,
              height: 44,
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: iconColor,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 120ms ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          {/* Menú desplegable - ENLACES LEGALES */}
          {menuOpen && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                right: 0,
                background: menuColors.bg,
                borderRadius: '12px',
                padding: '8px',
                minWidth: '220px',
                boxShadow: menuColors.shadow,
                border: menuColors.border,
                zIndex: 100,
                animation: 'fadeInUp 0.2s ease-out'
              }}
            >
              <div style={{
                padding: '12px 16px',
                color: menuColors.text,
                fontSize: '13px',
                fontWeight: 500,
                fontStyle: 'italic',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '4px'
              }}>
                📄 Información legal
              </div>
              
              <ul style={{ 
                listStyle: 'none', 
                margin: 0, 
                padding: 0, 
                display: 'flex', 
                flexDirection: 'column',
                gap: '2px' 
              }}>
                <li>
                  <Link
                    to="/legal/cookies"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      color: menuColors.text,
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '15px',
                      transition: 'all 120ms ease',
                      fontFamily: 'Roboto, serif'
                    }}
                    onMouseEnter={(e) => e.target.style.background = menuColors.hover}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    onClick={() => setMenuOpen(false)}
                  >
                    🍪 Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/aviso-legal"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      color: menuColors.text,
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '15px',
                      transition: 'all 120ms ease',
                      fontFamily: 'Roboto, serif'
                    }}
                    onMouseEnter={(e) => e.target.style.background = menuColors.hover}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    onClick={() => setMenuOpen(false)}
                  >
                    ⚖️ Aviso Legal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/privacidad"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      color: menuColors.text,
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '15px',
                      transition: 'all 120ms ease',
                      fontFamily: 'Roboto, serif'
                    }}
                    onMouseEnter={(e) => e.target.style.background = menuColors.hover}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    onClick={() => setMenuOpen(false)}
                  >
                    🔒 Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/terminos"
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      color: menuColors.text,
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '15px',
                      transition: 'all 120ms ease',
                      fontFamily: 'Roboto, serif'
                    }}
                    onMouseEnter={(e) => e.target.style.background = menuColors.hover}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    onClick={() => setMenuOpen(false)}
                  >
                    📝 Términos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Estilos scoped */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          footer > div {
            padding: 0 12px;
          }
          
          footer > div > div:nth-child(2) {
            font-size: 13px;
          }
        }
        
        /* Accesibilidad */
        button:focus {
          outline: 3px solid rgba(75, 116, 77, 0.3);
          outline-offset: 2px;
        }
        
        a:focus {
          outline: 3px solid rgba(75, 116, 77, 0.3);
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;