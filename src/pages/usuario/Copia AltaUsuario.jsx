import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';

const AltaUsuario = () => {
  const { theme } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ========== DIAGNÓSTICO AUTH ==========
  useEffect(() => {
    console.log("========================================");
    console.log("🔍 DIAGNÓSTICO AUTH CONTEXT");
    console.log("Auth completo:", auth);
    console.log("quickRegister disponible:", auth.quickRegister);
    console.log("Tipo quickRegister:", typeof auth.quickRegister);
    console.log("Es función?:", typeof auth.quickRegister === 'function');
    console.log("========================================");
  }, [auth]);

  // ========== DEPURACIÓN ==========
  useEffect(() => {
    console.log("========================================");
    console.log("🔍 DEPURACIÓN - ALTAUSUARIO.JSX CARGADO");
    console.log("URL completa:", window.location.href);
    console.log("Pathname:", location.pathname);
    console.log("Componente: AltaUsuario.jsx (FICHA COMPLETA)");
    console.log("========================================");
  }, [location]);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    esPromotor: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validandoUsuario, setValidandoUsuario] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Colores según tema
  const bgColor = theme === 'night' ? '#060712' : '#F9F7F4';
  const textColor = theme === 'night' ? '#E2E8F0' : '#1E2933';
  const mutedColor = theme === 'night' ? '#94A3B8' : '#64748B';
  const surfaceColor = theme === 'night' ? '#1E293B' : '#FFFFFF';
  const borderColor = theme === 'night' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 224, 0.4)';
  const primaryColor = theme === 'night' ? '#7A9A7E' : '#4B744D';
  const errorColor = '#DC2626';
  const successColor = '#10B981';

  // --- VALIDAR NOMBRE DE USUARIO EN TIEMPO REAL ---
  const validarNombreUsuarioUnico = async (nombreUsuario) => {
    if (!nombreUsuario || nombreUsuario.length < 3) return null;
    
    try {
      const { data, error } = await supabase
        .rpc('nombre_usuario_existe', { nombre_usuario_buscar: nombreUsuario.toLowerCase() });

      if (error) {
        console.error('Error validando nombre usuario:', error);
        return null;
      }

      return data === true;
    } catch (error) {
      console.error('Excepción validando nombre usuario:', error);
      return null;
    }
  };

  // --- VALIDAR EMAIL ÚNICO ---
  const validarEmailUnico = async (email) => {
    if (!email) return null;
    
    try {
      const { data, error } = await supabase
        .rpc('email_existe', { email_buscar: email.toLowerCase() });

      if (error) {
        console.error('Error validando email:', error);
        return null;
      }

      return data === true;
    } catch (error) {
      console.error('Excepción validando email:', error);
      return null;
    }
  };

  // --- VALIDAR TELÉFONO ÚNICO (solo si hay teléfono) ---
  const validarTelefonoUnico = async (telefono) => {
    if (!telefono || telefono.trim() === '') return { existe: false, mensaje: null };
    
    const telefonoLimpio = telefono.replace(/\s/g, '');
    if (telefonoLimpio.length !== 9) return { existe: false, mensaje: null };
    
    try {
      const { data, error } = await supabase
        .rpc('telefono_existe', { telefono_buscar: telefonoLimpio });

      if (error) {
        console.error('Error RPC telefono_existe:', error);
        return { existe: false, error: 'Error verificando teléfono' };
      }

      return { 
        existe: data === true, 
        mensaje: data === true ? 'El teléfono ya está registrado' : null 
      };
    } catch (error) {
      console.error('Excepción verificando teléfono:', error);
      return { existe: false, error: 'Error de conexión' };
    }
  };

  // Validación en tiempo real al perder foco
  const handleUsuarioBlur = async () => {
    const nombreUsuario = formData.nombre_usuario.trim();
    
    if (!nombreUsuario) {
      setErrors(prev => ({ ...prev, nombre_usuario: 'El nombre de usuario es obligatorio' }));
      return;
    }
    
    if (nombreUsuario.length < 3) {
      setErrors(prev => ({ ...prev, nombre_usuario: 'Mínimo 3 caracteres' }));
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(nombreUsuario)) {
      setErrors(prev => ({ ...prev, nombre_usuario: 'Solo letras, números y guión bajo (_)' }));
      return;
    }
    
    setValidandoUsuario(true);
    const existe = await validarNombreUsuarioUnico(nombreUsuario);
    setValidandoUsuario(false);
    
    if (existe === true) {
      setErrors(prev => ({ ...prev, nombre_usuario: 'Este nombre de usuario ya está en uso' }));
    } else if (existe === false) {
      setErrors(prev => ({ ...prev, nombre_usuario: '' }));
    }
  };

  // VALIDACIÓN TELÉFONO MÓVIL ESPAÑOL (solo si hay teléfono)
  const validarTelefonoEspanol = (numero) => {
    if (!numero || numero.trim() === '') {
      return { valido: true, error: null }; // Vacío es válido para clientes
    }
    
    const numLimpio = numero.replace(/\s/g, '');
    
    // 1. 9 dígitos exactos
    if (!/^[0-9]{9}$/.test(numLimpio)) {
      return { valido: false, error: 'El móvil debe tener 9 dígitos' };
    }
    
    // 2. Primer dígito 6 o 7 (móvil español)
    if (!['6', '7'].includes(numLimpio.charAt(0))) {
      return { valido: false, error: 'Debe comenzar por 6 o 7 (móvil español)' };
    }
    
    return { valido: true, error: null };
  };

  // Validaciones básicas del formulario
  const validateForm = () => {
    const newErrors = {};

    // Nombre de usuario
    if (!formData.nombre_usuario.trim()) {
      newErrors.nombre_usuario = 'El nombre de usuario es obligatorio';
    } else if (formData.nombre_usuario.length < 3) {
      newErrors.nombre_usuario = 'Mínimo 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.nombre_usuario)) {
      newErrors.nombre_usuario = 'Solo letras, números y _';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[a-zA-Z0-9._%+-ñÑáéíóúÁÉÍÓÚ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email no válido. Usa formato: usuario@dominio.es';
    }    

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }

    // Teléfono: obligatorio solo para promotores
    if (formData.esPromotor) {
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es obligatorio para promotores';
      } else {
        const validacionTelefono = validarTelefonoEspanol(formData.telefono);
        if (!validacionTelefono.valido) {
          newErrors.telefono = validacionTelefono.error;
        }
      }
    } else {
      // Para clientes, si ponen teléfono, que sea válido
      if (formData.telefono.trim() !== '') {
        const validacionTelefono = validarTelefonoEspanol(formData.telefono);
        if (!validacionTelefono.valido) {
          newErrors.telefono = validacionTelefono.error;
        }
      }
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    // Confirmar contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Formatear teléfono mientras se escribe (9 dígitos máximo)
  const handleTelefonoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    // Formato: XXX XXX XXX
    if (value.length > 6) {
      value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)} ${value.slice(3)}`;
    }
    
    setFormData(prev => ({ ...prev, telefono: value }));
    if (errors.telefono) {
      setErrors(prev => ({ ...prev, telefono: '' }));
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {

      
console.log("📝 Iniciando validación de datos únicos...");

      // 1. Verificar nombre de usuario único (doble check)
      const usuarioExiste = await validarNombreUsuarioUnico(formData.nombre_usuario);
      
      if (usuarioExiste === null) {
        setErrors({ 
          general: 'Error verificando usuario. Inténtalo de nuevo.',
          nombre_usuario: 'Error de conexión. Inténtalo de nuevo.'
        });
        setIsSubmitting(false);
        return;
      }
      
      if (usuarioExiste === true) {
        setErrors({ 
          general: 'Nombre de usuario no disponible.',
          nombre_usuario: 'Este nombre de usuario ya está en uso. Prueba con otro.'
        });
        setIsSubmitting(false);
        return;
      }
      
      // 2. Verificar email único
      const emailExiste = await validarEmailUnico(formData.email);
      console.log("🔍 DEBUG emailExiste:", emailExiste, "tipo:", typeof emailExiste);
      
      if (emailExiste === null) {
        setErrors({ 
          general: 'Error verificando email. Inténtalo de nuevo.',
          email: 'Error de conexión. Inténtalo de nuevo.'
        });
        setIsSubmitting(false);
        return;
      }
      
      if (emailExiste === true) {
        setErrors({ 
          general: 'Email ya registrado.',
          email: 'Este email ya está registrado. ¿Olvidaste tu contraseña?'
        });
        setIsSubmitting(false);
        return;
      }    

      // 3. Verificar teléfono único (solo si hay teléfono)
      if (formData.telefono.trim() !== '') {
        const telefonoLimpio = formData.telefono.replace(/\s/g, '');
        const verificacionTelefono = await validarTelefonoUnico(telefonoLimpio);
        
        if (verificacionTelefono.error) {
          setErrors({ 
            general: 'Error verificando teléfono.',
            telefono: verificacionTelefono.error
          });
          setIsSubmitting(false);
          return;
        }
        
        if (verificacionTelefono.existe) {
          setErrors({ 
            general: 'Teléfono ya registrado.',
            telefono: 'Este número de teléfono ya está registrado. Contacta con soporte si es un error.'
          });
          setIsSubmitting(false);
          return;
        }
      }

      console.log("✅ Todos los datos son únicos. Preparando para verificación email...");

      
      // 1. Preparar datos para verificación (SIN crear usuario todavía)
      const telefonoLimpio = formData.telefono.replace(/\s/g, '');

      const userData = {
        nombre_usuario: formData.nombre_usuario.toLowerCase(),
        email: formData.email.toLowerCase(),
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        telefono: telefonoLimpio || null,
        password: formData.password,
        tipo_usuario: formData.esPromotor ? 'promotor' : 'cliente'
      };

      // 2. ENVIAR EMAIL DE VERIFICACIÓN (sin esperar ni verificar éxito)
      console.log("📤 Enviando email de verificación a:", userData.email);
      fetch('http://localhost:3001/api/send-verification', {
      // Llamada asíncrona sin await - no bloquea navegación

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userData.email,
          userData: userData
        })
      }).then(response => {
        if (!response.ok) {
          console.warn("⚠️ Email podría no haberse enviado, pero continuamos");
        } else {
          console.log("✅ Petición email enviada al servidor");
        }
      }).catch(error => {
        console.error("❌ Error en envío email (continúa igual):", error);
      });

      // 3. Navegar a verificación email (INMEDIATO - no espera respuesta email)
      console.log("📍 Navegando a VerificacionEmail.jsx");
      navigate('/VerificacionEmail', { state: userData });
      
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ 
        general: error.message || 'Error inesperado. Por favor, inténtalo de nuevo.' 
      });
      setIsSubmitting(false);
    }
  };

  // Volver atrás
  const handleVolver = () => {
    navigate(-1);
  };

  // Alternar visibilidad de contraseña
  const toggleMostrarPassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header theme={theme} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', backgroundColor: bgColor }}>
        <div style={{ width: '100%', maxWidth: '500px', backgroundColor: surfaceColor, borderRadius: '14px', padding: '2rem', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: `1px solid ${borderColor}` }}>
          
          {/* Título */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'Roboto, serif', fontSize: '1.75rem', fontWeight: 700, color: primaryColor, margin: '0 0 0.5rem 0' }}>
              Crear cuenta
            </h1>
            <p style={{ color: mutedColor, fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
              Completa todos los campos para registrarte
            </p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div style={{ backgroundColor: theme === 'night' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2', color: theme === 'night' ? '#FCA5A5' : errorColor, padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: `1px solid ${theme === 'night' ? 'rgba(252, 165, 165, 0.2)' : '#FECACA'}`, fontSize: '0.875rem', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            
            {/* Campo Nombre de Usuario */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Nombre de usuario *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="nombre_usuario"
                  value={formData.nombre_usuario}
                  onChange={handleChange}
                  onBlur={handleUsuarioBlur}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem', backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC', border: `1px solid ${errors.nombre_usuario ? errorColor : borderColor}`, borderRadius: '8px', color: textColor, fontSize: '1rem', fontFamily: 'Roboto, sans-serif', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                  placeholder="juanperez"
                  disabled={isSubmitting || validandoUsuario}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.9rem', fontWeight: 500 }}>
                  @
                </span>
              </div>
              <div style={{ marginTop: '0.25rem' }}>
                {validandoUsuario && (
                  <span style={{ display: 'block', color: primaryColor, fontSize: '0.7rem' }}>
                    Validando nombre de usuario...
                  </span>
                )}
                {errors.nombre_usuario && !validandoUsuario && (
                  <span style={{ display: 'block', color: errorColor, fontSize: '0.7rem' }}>
                    {errors.nombre_usuario}
                  </span>
                )}
                {!errors.nombre_usuario && !validandoUsuario && (
                  <span style={{ display: 'block', color: mutedColor, fontSize: '0.7rem' }}>
                    Letras, números y _ • Mínimo 3 caracteres • Único
                  </span>
                )}
              </div>
            </div>

            {/* Campo Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC', border: `1px solid ${errors.email ? errorColor : borderColor}`, borderRadius: '8px', color: textColor, fontSize: '1rem', fontFamily: 'Roboto, sans-serif', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span style={{ display: 'block', marginTop: '0.25rem', color: errorColor, fontSize: '0.7rem' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Campo Nombre */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC', border: `1px solid ${errors.nombre ? errorColor : borderColor}`, borderRadius: '8px', color: textColor, fontSize: '1rem', fontFamily: 'Roboto, sans-serif', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                placeholder="Tu nombre"
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <span style={{ display: 'block', marginTop: '0.25rem', color: errorColor, fontSize: '0.7rem' }}>
                  {errors.nombre}
                </span>
              )}
            </div>

            {/* Campo Apellidos */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC', border: `1px solid ${errors.apellidos ? errorColor : borderColor}`, borderRadius: '8px', color: textColor, fontSize: '1rem', fontFamily: 'Roboto, sans-serif', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                placeholder="Tus apellidos"
                disabled={isSubmitting}
              />
              {errors.apellidos && (
                <span style={{ display: 'block', marginTop: '0.25rem', color: errorColor, fontSize: '0.7rem' }}>
                  {errors.apellidos}
                </span>
              )}
            </div>

            {/* Campo Teléfono Móvil Español */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Teléfono Móvil Español {formData.esPromotor ? '*' : ''}
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                {/* +34 FIJO (no editable) */}
                <div style={{ 
                  width: '60px', 
                  padding: '0.75rem 0.5rem',
                  backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  fontFamily: 'Roboto Mono, monospace',
                  boxSizing: 'border-box'
                }}>
                  +34
                </div>
                
                {/* TELÉFONO (opcional para clientes) */}
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleTelefonoChange}
                  style={{ 
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
                    border: `1px solid ${errors.telefono ? errorColor : borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    boxSizing: 'border-box'
                  }}
                  placeholder={formData.esPromotor ? "600 123 456 (obligatorio)" : "600 123 456 (opcional)"}
                  disabled={isSubmitting}
                  maxLength="11"
                />
              </div>
              
              {/* Mensajes de error/validación */}
              <div style={{ marginTop: '0.25rem' }}>
                {errors.telefono && (
                  <span style={{ display: 'block', color: errorColor, fontSize: '0.7rem' }}>
                    {errors.telefono}
                  </span>
                )}
                {!errors.telefono && (
                  <span style={{ display: 'block', color: mutedColor, fontSize: '0.7rem' }}>
                    {formData.esPromotor ? 'Obligatorio para promotores' : 'Opcional para clientes'} • 9 dígitos • Móvil español (6xx, 7xx)
                  </span>
                )}
              </div>
            </div>

            {/* Campo Contraseña */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC', border: `1px solid ${errors.password ? errorColor : borderColor}`, borderRadius: '8px', color: textColor, fontSize: '1rem', fontFamily: 'Roboto, sans-serif', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                  placeholder="••••••"
                  disabled={isSubmitting}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.9rem' }}>
                  🔒
                </span>
                <button
                  type="button"
                  onClick={toggleMostrarPassword}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: mutedColor, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span style={{ display: 'block', marginTop: '0.25rem', color: errorColor, fontSize: '0.7rem' }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: textColor, fontSize: '0.875rem', fontFamily: 'Roboto, sans-serif' }}>
                Confirmar contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC', border: `1px solid ${errors.confirmPassword ? errorColor : borderColor}`, borderRadius: '8px', color: textColor, fontSize: '1rem', fontFamily: 'Roboto, sans-serif', transition: 'all 0.2s ease', boxSizing: 'border-box' }}
                  placeholder="••••••"
                  disabled={isSubmitting}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.9rem' }}>
                  🔒
                </span>
              </div>
              {errors.confirmPassword && (
                <span style={{ display: 'block', marginTop: '0.25rem', color: errorColor, fontSize: '0.7rem' }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Checkbox Es Promotor */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: theme === 'night' ? 'rgba(122, 154, 126, 0.05)' : 'rgba(75, 116, 77, 0.03)', borderRadius: '8px', border: `1px solid ${borderColor}` }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: textColor, fontFamily: 'Roboto, sans-serif' }}>
                <input
                  type="checkbox"
                  name="esPromotor"
                  checked={formData.esPromotor}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ marginRight: '0.75rem', width: '1.25rem', height: '1.25rem', accentColor: primaryColor, cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    ¿Eres promotor de actividades?
                  </div>
                  <div style={{ fontSize: '0.875rem', color: mutedColor, lineHeight: 1.4 }}>
                    Los promotores requieren teléfono obligatorio, validación por email y podrán gestionar entidades y eventos.
                    Si solo quieres buscar actividades, deja esta opción desmarcada.
                  </div>
                </div>
              </label>
            </div>

            {/* Botones - 2 BOTONES IGUALES */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={handleVolver}
                disabled={isSubmitting}
                style={{ flex: 1, padding: '0.875rem', backgroundColor: 'transparent', color: textColor, border: `1px solid ${borderColor}`, borderRadius: '14px', fontSize: '1rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s ease', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={(e) => { if (!isSubmitting) e.target.style.backgroundColor = theme === 'night' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 224, 0.2)' }}
                onMouseLeave={(e) => { if (!isSubmitting) e.target.style.backgroundColor = 'transparent' }}
              >
                Volver
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ flex: 1, padding: '0.875rem', backgroundColor: primaryColor, color: '#FFFFFF', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s ease', fontFamily: 'Montserrat, sans-serif', boxShadow: theme === 'night' ? '0 4px 12px rgba(122, 154, 126, 0.3)' : '0 4px 12px rgba(75, 116, 77, 0.3)' }}
                onMouseEnter={(e) => { if (!isSubmitting) { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = theme === 'night' ? '0 6px 16px rgba(122, 154, 126, 0.4)' : '0 6px 16px rgba(75, 116, 77, 0.4)' } }}
                onMouseLeave={(e) => { if (!isSubmitting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = theme === 'night' ? '0 4px 12px rgba(122, 154, 126, 0.3)' : '0 4px 12px rgba(75, 116, 77, 0.3)' } }}
              >
                {isSubmitting ? 'Validando...' : 'Continuar'}
              </button>
            </div>

            {/* Información adicional */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${borderColor}`, textAlign: 'center' }}>
              <p style={{ color: mutedColor, fontSize: '0.875rem', lineHeight: 1.5, margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                Al continuar, aceptas nuestros{' '}
                <a 
                  href="/legal/terminos" 
                  style={{ color: primaryColor, textDecoration: 'none', fontWeight: 600 }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Términos de Uso
                </a>{' '}
                y{' '}
                <a 
                  href="/legal/privacidad" 
                  style={{ color: primaryColor, textDecoration: 'none', fontWeight: 600 }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Política de Privacidad
                </a>.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AltaUsuario