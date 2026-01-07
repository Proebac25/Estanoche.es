import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const VerificacionEmail = () => {
  const { theme } = useTheme();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Estados
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(900);
  const [reenviando, setReenviando] = useState(false);

  // COLORES IDÉNTICOS a AltaUsuario.jsx
  const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';
  const textColor = theme === 'night' ? '#E2E8F0' : '#1E2933';
  const mutedColor = theme === 'night' ? '#94A3B8' : '#64748B';
  const surfaceColor = theme === 'night' ? '#1E293B' : '#FFFFFF';
  const borderColor = theme === 'night' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 224, 0.4)';
  const primaryColor = theme === 'night' ? '#7A9A7E' : '#4B744D';
  const errorColor = '#DC2626';
  const successColor = '#10B981';

  // Función para reenviar código
  const reenviarCodigo = async () => {
    if (!email) return;

    setReenviando(true);
    setError('');

    const userData = JSON.parse(localStorage.getItem('pending_user_data') || '{}');

    try {
      console.log('🔄 Reenviando código a:', email);

      const response = await fetch('http://localhost:3001/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          userData: userData
        })
      });

      const data = await response.json();

      // DEPURACIÓN: Verificar respuesta del servidor
      console.log("📡 Respuesta server completa:", data);
      console.log("📊 Tipo recibido:", data.tipo);
      console.log("🆔 UserId recibido:", data.userId);
      console.log("✅ Success recibido:", data.success);
      console.log("📝 Mensaje recibido:", data.message);


      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      console.log('✅ Código reenviado:', data);
      setSuccess(`Nuevo código enviado a ${email}`);
      setTiempoRestante(900); // Reset timer

    } catch (error) {
      console.error('❌ Error reenviando email:', error);
      setError(`Error al reenviar el código: ${error.message}`);
    } finally {
      setReenviando(false);
    }
  };

  // Obtener email al cargar (State o LocalStorage)
  useEffect(() => {
    // 1. Intentar leer del State (Navegación directa)
    let userDataVal = location.state;
    let userEmail = location.state?.email;

    // 2. Si no hay State, intentar LocalStorage (Recarga de página)
    if (!userEmail) {
      try {
        const stored = JSON.parse(localStorage.getItem('pending_user_data') || '{}');
        if (stored && stored.email) {
          userDataVal = stored;
          userEmail = stored.email;
          console.log('🔄 Datos recuperados de LocalStorage');
        }
      } catch (e) {
        console.error('Error leyendo LocalStorage', e);
      }
    }

    if (!userEmail) {
      setError('No se encontró dirección de email. Por favor, regístrate de nuevo.');
      return;
    }

    setEmail(userEmail);
    // Guardar/Actualizar backup en LocalStorage
    localStorage.setItem('pending_user_data', JSON.stringify(userDataVal || {}));

    // Solo mostrar mensaje de éxito si venimos de navegación directa (State presente)
    if (location.state?.email) {
      console.log('📨 Código enviado desde AltaUsuario.jsx');
      setSuccess(`Código enviado a ${userEmail}`);
    } else {
      // Si es recuperación, no mostrar "Código enviado" para no confundir,
      // a menos que acabemos de recargar.
      setSuccess(`Verificando cuenta para ${userEmail}`);
    }

    // Iniciar timer
    setTiempoRestante(900);
  }, [location.state]);

  // Timer
  useEffect(() => {
    if (tiempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTiempoRestante(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Verificar código con backend
  const handleVerify = async () => {
    const codigoCompleto = codigo.join('');

    if (codigoCompleto.length !== 6) {
      setError('Introduce un código de 6 dígitos');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (location.state?.modo === 'update') {
        if (!auth.user?.id) throw new Error("ID de usuario no encontrado");

        console.log('🔄 Verificando cambio de email para:', email);

        const response = await fetch('/api/verify-change-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            code: codigoCompleto,
            userId: auth.user.id
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Código incorrecto');
        }

        console.log('✅ Email actualizado:', data);
        setSuccess('¡Email actualizado correctamente!');

        // Actualizar sesión local
        const updatedUser = { ...auth.user, email: email };
        auth.loginManual(updatedUser);

        setTimeout(() => navigate(-1), 1500); // Volver atrás (Ficha)

      } else {
        // --- FLUJO ORIGINAL DE REGISTRO ---
        console.log('🔐 Verificando código para registro:', email);

        const response = await fetch('/api/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            code: codigoCompleto
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Código incorrecto');
        }

        console.log('✅ Código verificado (Registro):', data);
        setSuccess('¡Email verificado correctamente!');

        // Preparar objeto de usuario FINAL
        const userData = JSON.parse(localStorage.getItem('pending_user_data') || '{}');
        const finalUser = {
          ...userData,
          id: data.userId, // ID de Supabase
          tipo: data.tipo || userData.tipo
        };

        // Guardar sesión en Contexto GLOBAL
        auth.loginManual(finalUser);

        // Navegar según tipo de usuario
        setTimeout(() => {
          if (finalUser.tipo === 'promotor' || finalUser.tipo === 'promotor_pendiente') {
            navigate('/ConfirmarTelefono', { state: { upgrade: false } });
          } else {
            navigate('/RegistroCliente');
          }
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Error verificando código:', error);
      setError(error.message || 'Error al verificar el código');
      setIsSubmitting(false);
    }
  };

  // Inputs VISIBLES
  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < 6; i++) {
      inputs.push(
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={codigo[i]}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length > 1) return;

            const newCode = [...codigo];
            newCode[i] = value;
            setCodigo(newCode);
            setError('');

            if (value && i < 5) {
              document.getElementById(`code-${i + 1}`)?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !codigo[i] && i > 0) {
              document.getElementById(`code-${i - 1}`)?.focus();
            }
          }}
          id={`code-${i}`}
          style={{
            width: '50px',
            height: '60px',
            backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
            border: `1px solid ${error ? errorColor : borderColor}`,
            borderRadius: '8px',
            color: textColor,
            fontSize: '24px',
            fontFamily: 'Roboto Mono, monospace',
            textAlign: 'center',
            fontWeight: 700,
            boxSizing: 'border-box',
            margin: '0 4px',
            transition: 'border-color 0.2s ease'
          }}
          autoFocus={i === 0}
          disabled={isSubmitting}
        />
      );
    }
    return inputs;
  };

  // ESTRUCTURA IDÉNTICA a AltaUsuario.jsx
  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header theme={theme} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', backgroundColor: bgColor }}>
        <div style={{ width: '100%', maxWidth: '500px', backgroundColor: surfaceColor, borderRadius: '14px', padding: '2rem', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: `1px solid ${borderColor}` }}>

          {/* Título personalizado */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'Roboto, serif', fontSize: '1.75rem', fontWeight: 700, color: primaryColor, margin: '0 0 0.5rem 0' }}>
              {(() => {
                const nombre = location.state?.nombre || location.state?.nombre_usuario;
                if (!nombre) return 'Verifica tu email';

                // Capitalizar primera letra de cada palabra
                const capitalizado = nombre.split(' ').map(palabra =>
                  palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
                ).join(' ');

                return `${capitalizado}, verifica tu email`;
              })()}
            </h1>
            <p style={{ color: mutedColor, fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
              Introduce el código de 6 dígitos que enviamos a:
            </p>
            <p style={{ color: textColor, fontSize: '1rem', fontWeight: 600, margin: '0.5rem 0 1.5rem 0' }}>
              {email || 'cargando...'}
            </p>
          </div>

          {/* Mensajes */}
          {error && (
            <div style={{ backgroundColor: theme === 'night' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2', color: theme === 'night' ? '#FCA5A5' : errorColor, padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: `1px solid ${theme === 'night' ? 'rgba(252, 165, 165, 0.2)' : '#FECACA'}`, fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: theme === 'night' ? 'rgba(16, 185, 129, 0.1)' : '#D1FAE5', color: theme === 'night' ? '#A7F3D0' : successColor, padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: `1px solid ${theme === 'night' ? 'rgba(167, 243, 208, 0.2)' : '#A7F3D0'}`, fontSize: '0.875rem', textAlign: 'center' }}>
              {success}
            </div>
          )}

          {/* Inputs de código */}
          <div style={{ marginBottom: '2rem' }}>

            {/* PANEL DE DEPURACIÓN - VALIDACIÓN EMAIL */}
            <div style={{
              backgroundColor: theme === 'night' ? '#1E293B' : '#F1F5F9',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: `1px solid ${borderColor}`,
              fontSize: '0.75rem',
              fontFamily: 'Roboto Mono, monospace',
              wordBreak: 'break-all'
            }}>
              <div style={{ color: primaryColor, fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔍</span>
                <span>DEPURACIÓN - VERIFICACIÓN DUPLICADOS</span>
              </div>
              <div style={{ color: mutedColor, lineHeight: '1.6' }}>
                <div><strong>📧 Email recibido:</strong> {email || 'NO DEFINIDO'}</div>
                <div><strong>👤 Nombre usuario:</strong> {location.state?.nombre_usuario || 'NO DEFINIDO'}</div>
                <div><strong>📱 Teléfono:</strong> {location.state?.telefono || '(null/vacío)'}</div>

                {/* SECCIÓN CRÍTICA - VERIFICACIÓN DUPLICADOS */}
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: theme === 'night' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2', borderRadius: '6px', border: `1px solid ${errorColor}20` }}>
                  <div style={{ color: errorColor, fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ ESTADO VALIDACIÓN DUPLICADOS:</div>

                  {/* Estado desde AltaUsuario.jsx (inferido) */}
                  <div><strong>🔍 Desde AltaUsuario.jsx:</strong></div>
                  <div style={{ marginLeft: '1rem' }}>
                    <div>• Email duplicado: <span style={{ fontWeight: 700, color: location.state?.email ? '#DC2626' : mutedColor }}>{location.state?.email ? 'NO DETECTADO (pasó)' : 'NO SABEMOS'}</span></div>
                    <div>• Usuario duplicado: <span style={{ fontWeight: 700, color: location.state?.nombre_usuario ? '#DC2626' : mutedColor }}>{location.state?.nombre_usuario ? 'NO DETECTADO (pasó)' : 'NO SABEMOS'}</span></div>
                    <div>• Teléfono duplicado: <span style={{ fontWeight: 700, color: location.state?.telefono ? '#DC2626' : mutedColor }}>{location.state?.telefono ? 'NO DETECTADO (pasó)' : 'NO APLICA (null)'}</span></div>
                  </div>

                  {/* Necesitamos verificar ahora mismo si existen duplicados */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>🔎 Verificación en tiempo real:</strong>
                    <button
                      onClick={async () => {
                        console.log('🔄 Verificando duplicados en tiempo real...');

                        // Verificar email
                        if (email) {
                          try {
                            const response = await fetch(`http://localhost:3001/check-email?email=${encodeURIComponent(email)}`);
                            const data = await response.json();
                            console.log('📧 Email check:', data);
                            alert(`Email ${email}: ${data.exists ? 'EXISTE' : 'NO EXISTE'}`);
                          } catch (err) {
                            console.error('Error checking email:', err);
                          }
                        }
                      }}
                      style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: primaryColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        cursor: 'pointer'
                      }}
                    >
                      Verificar ahora
                    </button>
                  </div>
                </div>

                {/* Información adicional */}
                <div style={{ marginTop: '0.75rem' }}>
                  <div><strong>⏱️ Timer restante:</strong> {formatTime(tiempoRestante)}</div>
                  <div><strong>✅ Código ingresado:</strong> {codigo.join('') || 'VACÍO'}</div>
                  <div><strong>🔄 Reenviando activo:</strong> {reenviando ? 'SÍ' : 'NO'}</div>
                  <div><strong>⚡ Verificando:</strong> {isSubmitting ? 'SÍ' : 'NO'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              {renderInputs()}
            </div>

            {/* Timer */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: theme === 'night' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 224, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: mutedColor, fontSize: '0.875rem' }}>
                  Expira en: <strong style={{ color: tiempoRestante < 60 ? errorColor : primaryColor }}>{formatTime(tiempoRestante)}</strong>
                </span>
              </div>
              <p style={{ color: mutedColor, fontSize: '0.875rem' }}>
                ¿No llegó?{' '}
                <button
                  onClick={reenviarCodigo}
                  disabled={reenviando || tiempoRestante <= 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: (reenviando || tiempoRestante <= 0) ? mutedColor : primaryColor,
                    fontWeight: 600,
                    cursor: (reenviando || tiempoRestante <= 0) ? 'not-allowed' : 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {reenviando ? 'Reenviando...' : 'Reenviar código'}
                </button>
              </p>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
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
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.2s ease',
                fontFamily: 'Montserrat, sans-serif'
              }}
              onMouseEnter={(e) => { if (!isSubmitting) e.target.style.backgroundColor = theme === 'night' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 224, 0.2)' }}
              onMouseLeave={(e) => { if (!isSubmitting) e.target.style.backgroundColor = 'transparent' }}
            >
              Volver atrás
            </button>

            <button
              type="button"
              onClick={handleVerify}
              disabled={isSubmitting || codigo.join('').length !== 6}
              style={{
                flex: 1,
                padding: '0.875rem',
                backgroundColor: primaryColor,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: (isSubmitting || codigo.join('').length !== 6) ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || codigo.join('').length !== 6) ? 0.7 : 1,
                transition: 'all 0.2s ease',
                fontFamily: 'Montserrat, sans-serif',
                boxShadow: theme === 'night' ? '0 4px 12px rgba(122, 154, 126, 0.3)' : '0 4px 12px rgba(75, 116, 77, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && codigo.join('').length === 6) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = theme === 'night' ? '0 6px 16px rgba(122, 154, 126, 0.4)' : '0 6px 16px rgba(75, 116, 77, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && codigo.join('').length === 6) {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = theme === 'night' ? '0 4px 12px rgba(122, 154, 126, 0.3)' : '0 4px 12px rgba(75, 116, 77, 0.3)';
                }
              }}
            >
              {isSubmitting ? 'Verificando...' : 'Continuar'}
            </button>
          </div>

          {/* Información adicional */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${borderColor}`, textAlign: 'center' }}>
            <p style={{ color: mutedColor, fontSize: '0.875rem', lineHeight: 1.5, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
              🔒 El código es válido por 15 minutos.<br />
              📧 Revisa tu carpeta de spam si no encuentras el email.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerificacionEmail;