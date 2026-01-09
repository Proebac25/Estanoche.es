// D:\ene\src\components\HeaderLand.jsx - VERSIÓN CORREGIDA
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaUser, FaTimes, FaMobileAlt, FaChrome, FaEllipsisH, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoEN from '../assets/LogoEN.png';

const HeaderLand = ({ theme = 'day' }) => {
  const { user, login, logout, quickRegister, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const userButtonRef = useRef(null);
  const modalRef = useRef(null);
  const installModalRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }

      if (showLoginModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)) {
        setShowLoginModal(false);
        setLoginError('');
        setUsername('');
        setPassword('');
      }

      if (showInstallModal &&
        installModalRef.current &&
        !installModalRef.current.contains(event.target)) {
        setShowInstallModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, userMenuOpen, showLoginModal, showInstallModal]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setMenuOpen(false);
  };

  const goToHome = () => {
    navigate('/');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    // Login asíncrono
    const result = await login(username, password);

    if (result.success) {
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setUserMenuOpen(false);

      // Redirigir según el tipo de usuario
      const userType = result.user?.tipo?.toLowerCase();
      console.log('🔄 Redirigiendo login. User:', result.user);
      console.log('🔄 Tipo detectado:', userType);

      // alert(`DEBUG: Auth check.\nTipo: ${userType}\nID: ${result.user.id}`);

      if (userType === 'promotor' || userType === 'promotor_pendiente') {
        navigate('/RegistroPromotor');
      } else {
        navigate('/RegistroCliente');
      }
    } else {
      setLoginError(result.message || 'Credenciales incorrectas');
    }
  };

  const handleQuickRegister = () => {
    quickRegister();
    setUserMenuOpen(false);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    window.location.reload();
  };

  // Colores según tema
  const getIconColor = () => {
    return theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#1E2933';
  };

  const iconColor = getIconColor();

  // Colores para menús (verde oliva y blanco)
  const menuColors = {
    bg: '#4B744D',
    text: '#FFFFFF',
    hover: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: '0 12px 40px rgba(75, 116, 77, 0.3)'
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 90,
          background: 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 200ms ease'
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            position: 'relative'
          }}
        >
          {/* Menú hamburguesa */}
          <button
            ref={menuButtonRef}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            style={{
              width: 44,
              height: 44,
              color: iconColor,
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
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
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Logo */}
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
              justifyContent: 'center'
            }}
            aria-label="Ir al inicio"
          >
            <img
              src={LogoEN}
              alt="EstaNoche Logo"
              style={{
                height: '44px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </button>

          {/* Menú usuario - CAMBIADO: Ahora también muestra "X" cuando está abierto */}
          <button
            ref={userButtonRef}
            aria-label={userMenuOpen ? 'Cerrar menú de usuario' : 'Abrir menú de usuario'}
            aria-expanded={userMenuOpen}
            onClick={toggleUserMenu}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              color: iconColor,
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
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
            {userMenuOpen ? <FaTimes size={20} /> : <FaUser size={18} />}
          </button>
        </div>

        {/* Menú principal desplegable */}
        {menuOpen && (
          <nav
            ref={menuRef}
            role="navigation"
            aria-label="Menú principal"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 16,
              background: menuColors.bg,
              borderRadius: 12,
              padding: '8px',
              minWidth: 240,
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: menuColors.shadow,
              border: menuColors.border,
              zIndex: 100,
              animation: 'fadeInDown 0.2s ease-out'
            }}
          >
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {/* Primera opción - Instalación */}
              <li>
                <button
                  onClick={() => {
                    setShowInstallModal(true);
                    setMenuOpen(false);
                  }}
                  style={menuButtonStyle(menuColors)}
                >
                  <span style={{ fontSize: '18px', marginRight: '8px' }}><FaMobileAlt /></span>
                  Instálala en tu dispositivo
                </button>
              </li>

              {/* Separador */}
              <li style={{
                padding: '8px 16px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '4px'
              }}>
                {!isAuthenticated ? '🔒 Muy pronto disponible' : 'Opciones de usuario'}
              </li>

              {/* Mostrar opciones según autenticación */}
              {!isAuthenticated ? (
                // Usuario no autenticado - SOLO mensaje
                <li style={{
                  padding: '12px 16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  textAlign: 'center'
                }}>
                  Inicia sesión para acceder
                </li>
              ) : user.type === 'P' ? (
                // Productor autenticado
                <>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/RegistroPromotor');
                        setMenuOpen(false);
                      }}
                      style={menuButtonStyle(menuColors)}
                    >
                      <span style={{ fontSize: '18px' }}>👤</span>
                      <span>Gestión del Perfil</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/agenda');
                        setMenuOpen(false);
                      }}
                      style={menuButtonStyle(menuColors)}
                    >
                      <span style={{ fontSize: '18px' }}>🎭</span>
                      <span>Gestión de Agenda</span>
                    </button>
                  </li>
                  <li>
                    <a
                      href="/productor/entidades"
                      style={menuLinkStyle(menuColors)}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{ fontSize: '18px' }}>🏛️</span>
                      <span>Gestión de Entidades</span>
                    </a>
                  </li>
                </>
              ) : (
                // Cliente autenticado
                <li>
                  <button
                    onClick={() => {
                      navigate('/RegistroCliente');
                      setMenuOpen(false);
                    }}
                    style={menuButtonStyle(menuColors)}
                  >
                    <span style={{ fontSize: '18px' }}>👤</span>
                    <span>Gestión del Perfil</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Menú de usuario desplegable - MODIFICADO: Mismo diseño que menú principal */}
        {userMenuOpen && (
          <nav
            ref={userMenuRef}
            role="navigation"
            aria-label="Menú de usuario"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 16,
              background: menuColors.bg,
              borderRadius: 12,
              padding: '8px',
              minWidth: 240,
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: menuColors.shadow,
              border: menuColors.border,
              zIndex: 100,
              animation: 'fadeInDown 0.2s ease-out'
            }}
          >
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {!isAuthenticated ? (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setUserMenuOpen(false);
                      }}
                      style={menuButtonStyle(menuColors)}
                    >
                      <span style={{ fontSize: '18px', marginRight: '8px' }}>🔑</span>
                      Iniciar Sesión
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/AltaUsuario');
                        setUserMenuOpen(false);
                      }}
                      style={menuButtonStyle(menuColors)}
                    >
                      <span style={{ fontSize: '18px', marginRight: '8px' }}>➕</span>
                      Crear Cuenta
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={handleLogout}
                    style={menuButtonStyle(menuColors)}
                  >
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>🚪</span>
                    Cerrar Sesión
                  </button>
                </li>
              )}
            </ul>
            {/* ELIMINADO: Botón cerrar debajo - ahora se cierra con la X del icono */}
          </nav>
        )}

        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 880px) {
            header > div {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
            
            button[aria-label="Ir al inicio"] img {
              height: 36px !important;
            }
          }
        `}</style>
      </header>

      {/* Modal de Login - CORREGIDO: Botones alineados correctamente */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '16px',
            overflowY: 'auto'
          }}
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: theme === 'night' ? '#1E2933' : '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              paddingBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                color: theme === 'night' ? '#FFFFFF' : '#111111',
                fontSize: '24px',
                fontWeight: '600'
              }}>
                Iniciar Sesión
              </h3>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError('');
                  setUsername('');
                  setPassword('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: theme === 'night' ? 'rgba(255, 255, 255, 0.7)' : '#666',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ margin: 0, padding: 0 }}>
              {loginError && (
                <div style={{
                  backgroundColor: theme === 'night' ? 'rgba(220, 38, 38, 0.1)' : '#FEE2E2',
                  color: theme === 'night' ? '#FCA5A5' : '#DC2626',
                  border: `1px solid ${theme === 'night' ? 'rgba(220, 38, 38, 0.3)' : '#FCA5A5'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <span>⚠️</span>
                  {loginError}
                </div>
              )}
              {/* Campo Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#222222',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Introduce tu email"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.2)' : '#CCCCCC'}`,
                    backgroundColor: theme === 'night' ? 'rgba(255, 255, 255, 0.05)' : '#F8F9FA',
                    color: theme === 'night' ? '#FFFFFF' : '#111111',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Campo Contraseña */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#222222',
                  fontWeight: '500',
                  fontSize: '15px'
                }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce tu contraseña"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 45px 14px 16px', // Padding derecho extra para el icono
                      borderRadius: '8px',
                      border: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.2)' : '#CCCCCC'}`,
                      backgroundColor: theme === 'night' ? 'rgba(255, 255, 255, 0.05)' : '#F8F9FA',
                      color: theme === 'night' ? '#FFFFFF' : '#111111',
                      fontSize: '16px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: theme === 'night' ? 'rgba(255, 255, 255, 0.6)' : '#666666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONTENEDOR DE BOTONES - VERSIÓN SIMPLE */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                borderTop: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                paddingTop: '20px',
                marginTop: '0',
                width: '100%'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.2)' : '#CCCCCC'}`,
                    backgroundColor: 'transparent',
                    color: theme === 'night' ? 'rgba(255, 255, 255, 0.8)' : '#666666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#4B744D',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Ingresar
                </button>
              </div>            </form>
          </div>
        </div>
      )}

      {/* Modal de Instalación (sin cambios, se mantiene igual) */}
      {showInstallModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
            padding: '16px',
            overflowY: 'auto'
          }}
        >
          <div
            ref={installModalRef}
            style={{
              backgroundColor: theme === 'night' ? '#1E2933' : '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Cabecera */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              paddingBottom: '16px',
              flexShrink: 0
            }}>
              <h3 style={{
                margin: 0,
                color: theme === 'night' ? '#FFFFFF' : '#111111',
                fontSize: 'clamp(20px, 5vw, 24px)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FaMobileAlt /> Instalar EstaNoche.es
              </h3>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: theme === 'night' ? 'rgba(255, 255, 255, 0.7)' : '#666',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {/* Contenido scrollable */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  color: theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#222222',
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  lineHeight: 1.6,
                  marginBottom: '20px'
                }}>
                  Instala la app en tu dispositivo para acceso rápido y offline:
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {[
                    {
                      number: 1,
                      icon: <FaChrome />,
                      title: "Ábrela en tu navegador",
                      desc: "Ve a EstaNoche.es desde Chrome, Safari o Edge"
                    },
                    {
                      number: 2,
                      icon: <FaEllipsisH />,
                      title: "Toca los tres puntos",
                      desc: "En la esquina superior derecha del navegador"
                    },
                    {
                      number: 3,
                      icon: <FaCheck />,
                      title: '"Añadir a pantalla de inicio"',
                      desc: "Selecciona esta opción en el menú"
                    },
                    {
                      number: 4,
                      icon: null,
                      title: "Confirma la instalación",
                      desc: "La app aparecerá en tu pantalla de inicio"
                    }
                  ].map((step, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: theme === 'night' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#4B744D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        {step.number}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: '600',
                          color: theme === 'night' ? 'rgba(255, 255, 255, 0.9)' : '#222222',
                          marginBottom: '4px',
                          fontSize: 'clamp(13px, 4vw, 15px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: step.icon ? '8px' : '0'
                        }}>
                          {step.icon}
                          {step.title}
                        </div>
                        <div style={{
                          color: theme === 'night' ? 'rgba(255, 255, 255, 0.85)' : '#444444',
                          fontSize: 'clamp(12px, 3.5vw, 14px)',
                          lineHeight: 1.4
                        }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '14px',
                  backgroundColor: theme === 'night' ? 'rgba(75, 116, 77, 0.2)' : 'rgba(75, 116, 77, 0.1)',
                  borderRadius: '8px',
                  border: `1px solid ${theme === 'night' ? 'rgba(75, 116, 77, 0.3)' : 'rgba(75, 116, 77, 0.2)'}`
                }}>
                  <p style={{
                    margin: 0,
                    color: theme === 'night' ? '#FFFFFF' : '#222222',
                    fontSize: 'clamp(13px, 3.5vw, 14px)',
                    fontWeight: '500',
                    lineHeight: 1.5
                  }}>
                    💡 <strong>Ventajas:</strong> Acceso rápido, funciona offline,
                    notificaciones y experiencia similar a app nativa.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón fijo */}
            <div style={{
              borderTop: `1px solid ${theme === 'night' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              paddingTop: '16px',
              flexShrink: 0
            }}>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4B744D',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: 'clamp(15px, 4vw, 16px)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5D8B60'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4B744D'}
              >
                <FaCheck /> Entendido, ¡listo!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper para estilos
const menuLinkStyle = (colors) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  color: colors.text,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '15px',
  transition: 'all 120ms ease',
  fontFamily: 'Roboto, serif'
});

const menuButtonStyle = (colors) => ({
  display: 'block',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  color: colors.text,
  background: 'transparent',
  border: 'none',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '15px',
  transition: 'all 120ms ease',
  fontFamily: 'Roboto, serif',
  textAlign: 'left',
  cursor: 'pointer'
});

export default HeaderLand;