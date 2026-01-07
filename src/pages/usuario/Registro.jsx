import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/core/core-ui-v11.css';

const Registro = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Colores según tema
  const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';
  const textColor = theme === 'night' ? '#E2E8F0' : '#1E2933';
  const mutedColor = theme === 'night' ? '#94A3B8' : '#64748B';
  const surfaceColor = theme === 'night' ? '#1E293B' : '#FFFFFF';
  const borderColor = theme === 'night' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 224, 0.4)';
  const primaryColor = theme === 'night' ? '#7A9A7E' : '#4B744D';

  // Validar código (simulación)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!codigo.trim()) {
      setError('Por favor, introduce el código de validación');
      return;
    }

    setIsSubmitting(true);

    // Simulación de validación
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Simular éxito si el código tiene 6 dígitos
      if (/^\d{6}$/.test(codigo)) {
        setMensaje('✅ Código validado correctamente. Redirigiendo...');
        
        // Redirigir a ficha de promotor después de validación exitosa
        setTimeout(() => {
          navigate('/RegistroPromotor');
        }, 1500);
      } else {
        setError('❌ Código incorrecto. Debe tener 6 dígitos.');
      }
    }, 1000);
  };

  // Reenviar código (simulación)
  const handleReenviarCodigo = () => {
    setMensaje('📧 Código reenviado a tu email. Revisa tu bandeja de entrada.');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease'
    }}>
      <Header theme={theme} />

      {/* Contenido principal */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        backgroundColor: bgColor
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: surfaceColor,
          borderRadius: 'var(--radius, 14px)',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${borderColor}`
        }}>
          {/* Título */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-display, Roboto, serif)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: primaryColor,
              margin: '0 0 0.5rem 0'
            }}>
              Validación para Promotores
            </h1>
            <p style={{
              color: mutedColor,
              fontSize: '1rem',
              lineHeight: 1.5,
              margin: '0 0 1rem 0'
            }}>
              Para completar tu registro como promotor, necesitamos validar tu email.
            </p>
          </div>

          {/* Información del usuario */}
          {user && (
            <div style={{
              backgroundColor: theme === 'night' ? 'rgba(122, 154, 126, 0.05)' : 'rgba(75, 116, 77, 0.03)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: `1px solid ${borderColor}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {user.nombre?.charAt(0) || user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: textColor }}>
                    {user.nombre || user.name || 'Usuario'} {user.apellidos || ''}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: mutedColor }}>
                    {user.telefono ? `Tel: +34 ${user.telefono}` : 'Promotor en validación'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div style={{
            backgroundColor: theme === 'night' ? 'rgba(255, 107, 107, 0.05)' : 'rgba(255, 107, 107, 0.03)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: `1px solid ${theme === 'night' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.2)'}`
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                color: '#FF6B6B',
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}>
                ⚠️
              </div>
              <div>
                <div style={{ fontWeight: 600, color: textColor, marginBottom: '0.25rem' }}>
                  Importante para promotores
                </div>
                <div style={{ fontSize: '0.875rem', color: mutedColor, lineHeight: 1.4 }}>
                  Solo los promotores validados podrán crear entidades y eventos. 
                  Revisa tu email y introduce el código de 6 dígitos que hemos enviado.
                </div>
              </div>
            </div>
          </div>

          {/* Mensajes de éxito/error */}
          {mensaje && (
            <div style={{
              backgroundColor: theme === 'night' ? 'rgba(122, 154, 126, 0.1)' : 'rgba(75, 116, 77, 0.08)',
              color: primaryColor,
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: `1px solid ${theme === 'night' ? 'rgba(122, 154, 126, 0.2)' : 'rgba(75, 116, 77, 0.3)'}`,
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {mensaje}
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: theme === 'night' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
              color: theme === 'night' ? '#FCA5A5' : '#DC2626',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: `1px solid ${theme === 'night' ? 'rgba(252, 165, 165, 0.2)' : '#FECACA'}`,
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Formulario de validación */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: textColor,
                fontSize: '0.875rem'
              }}>
                Código de validación *
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${error ? '#DC2626' : borderColor}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '1.25rem',
                  letterSpacing: '2px',
                  textAlign: 'center',
                  fontFamily: 'monospace'
                }}
                maxLength="6"
                disabled={isSubmitting}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: mutedColor }}>
                  Introduce los 6 dígitos enviados a tu email
                </span>
                <button
                  type="button"
                  onClick={handleReenviarCodigo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: primaryColor,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: '4px 8px'
                  }}
                  disabled={isSubmitting}
                >
                  Reenviar código
                </button>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  backgroundColor: 'transparent',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius, 14px)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                Volver
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  backgroundColor: primaryColor,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius, 14px)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  fontFamily: 'var(--font-cta, Montserrat, sans-serif)'
                }}
              >
                {isSubmitting ? 'Validando...' : 'Validar código'}
              </button>
            </div>
          </form>

          {/* Información adicional */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: `1px solid ${borderColor}`,
            textAlign: 'center'
          }}>
            <p style={{
              color: mutedColor,
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: 0
            }}>
              ¿Problemas con la validación? Contacta con{' '}
              <a 
                href="mailto:soporte@estanoche.es" 
                style={{
                  color: primaryColor,
                  textDecoration: 'none',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                soporte@estanoche.es
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;