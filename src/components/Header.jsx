// D:\ene\src\components\Header.jsx - CON LOGO + "INICIO"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import LogoEN from '../assets/LogoEN.png';

const Header = ({ theme = 'day' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToHome = () => {
    navigate('/landing');
  };

  const handleContact = () => {
    window.location.href = 'mailto:proebac25@estanoche.es?subject=Contacto desde EstaNoche.es&body=Hola, me gustaría contactar con ustedes...';
  };

  // Colores según tema
  const getTextColor = () => {
    return theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#1E2933';
  };

  const textColor = getTextColor();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'transparent',
        transition: 'all 200ms ease'
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '12px 16px',
          position: 'relative',
          gap: '12px'
        }}
      >
        {/* IZQUIERDA: Logo + "Inicio" */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={goToHome}
            style={{
              background: 'transparent',
              border: 0,
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 120ms ease'
            }}
            aria-label="Ir al inicio"
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            <img
              src={LogoEN}
              alt="EstaNoche Logo"
              style={{
                height: '44px',
                width: 'auto',
                objectFit: 'contain',
                filter: theme === 'night' ? 'brightness(1.1)' : 'none'
              }}
            />
            <span
              style={{
                color: textColor,
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: 'Roboto, serif',
                letterSpacing: '0.5px'
              }}
            >
              Inicio
            </span>
          </button>
        </div>

        {/* CENTRO: Botón Mi Perfil (Solo si hay usuario logueado) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {user && (
            <button
              onClick={() => navigate('/RegistroPromotor')}
              style={{
                height: '44px',
                padding: '0 20px',
                backgroundColor: 'transparent',
                color: textColor,
                border: `1px solid ${theme === 'night' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                fontFamily: 'Roboto, serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 120ms ease'
              }}
              aria-label="Mi Perfil"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme === 'night' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FaUserCircle size={20} />
              <span>Mi Perfil</span>
            </button>
          )}
        </div>

        {/* DERECHA: Botón Contactar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleContact}
            style={{
              height: '44px', // Mismo alto que el logo
              padding: '0 20px',
              backgroundColor: '#4B744D', // Verde oliva
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: 'Roboto, serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 120ms ease',
              boxShadow: '0 2px 8px rgba(75, 116, 77, 0.2)',
              whiteSpace: 'nowrap'
            }}
            aria-label="Contactar por email"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#5D8B60'; // Verde más claro al hover
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(75, 116, 77, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4B744D';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(75, 116, 77, 0.2)';
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>✉️</span>
            <span>Contactar</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          header > div {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          
          button[aria-label="Ir al inicio"] img {
            height: 36px !important;
          }

          button[aria-label="Ir al inicio"] span {
            font-size: 16px !important;
          }

          button[aria-label="Contactar por email"] {
            height: 36px !important;
            padding: 0 16px !important;
            font-size: 14px !important;
          }

          button[aria-label="Contactar por email"] span:first-child {
            font-size: 16px !important;
          }
        }

        @media (max-width: 600px) {
          button[aria-label="Ir al inicio"] span {
            display: none; /* Oculta "Inicio" en móviles muy pequeños */
          }
          
          button[aria-label="Ir al inicio"] {
            gap: 0 !important;
          }
        }

        @media (max-width: 480px) {
          button[aria-label="Contactar por email"] span:last-child,
          button[aria-label="Mi Perfil"] span {
            display: none; /* Solo icono en móviles */
          }
          
          button[aria-label="Contactar por email"],
          button[aria-label="Mi Perfil"] {
            width: 44px;
            padding: 0 !important;
            justify-content: center;
          }

          button[aria-label="Contactar por email"] span:first-child {
            margin: 0;
            font-size: 20px !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;