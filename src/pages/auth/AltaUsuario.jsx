import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import { usuariosService } from '../../services/usuariosService';

const AltaUsuario = () => {
  const { theme } = useTheme();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [showPassword, setShowPassword] = useState(false);
  const [validandoUsuario, setValidandoUsuario] = useState(false);

  // Referencias para debounce
  const debounceUsuarioRef = useRef(null);
  const debounceEmailRef = useRef(null);

  // Estados para la validación en tiempo real
  const [validation, setValidation] = useState({
    nombre_usuario: { loading: false, valid: null, message: '' },
    email: { loading: false, valid: null, message: '' },
    telefono: { loading: false, valid: true, message: 'Opcional' },
    password: { valid: null, message: '' },
    confirmPassword: { valid: null, message: '' }
  });

  // Colores según el tema
  const colors = {
    bgColor: theme === 'night' ? '#060712' : '#F9F7F4',
    surfaceColor: theme === 'night' ? '#1E293B' : '#FFFFFF',
    textColor: theme === 'night' ? '#E2E8F0' : '#1E2933',
    mutedColor: theme === 'night' ? '#94A3B8' : '#64748B',
    borderColor: theme === 'night' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 224, 0.4)',
    primaryColor: theme === 'night' ? '#7A9A7E' : '#4B744D',
    errorColor: '#DC2626',
    successColor: '#10B981'
  };

  // Alias para compatibilidad
  const {
    bgColor,
    surfaceColor,
    textColor,
    mutedColor,
    borderColor,
    primaryColor,
    errorColor,
    successColor
  } = colors;

  // --- MANEJADOR DE CAMBIOS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validación en tiempo real (solo formato básico, la validación RPC se hace en onBlur)
    if (name === 'nombre_usuario') {
      // Solo validar formato básico mientras escribe
      if (value && value.length < 3) {
        setValidation(prev => ({
          ...prev,
          nombre_usuario: { loading: false, valid: false, message: 'Mínimo 3 caracteres' }
        }));
      } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
        setValidation(prev => ({
          ...prev,
          nombre_usuario: { loading: false, valid: false, message: 'Solo letras, números y guión bajo (_)' }
        }));
      } else if (value && value.length >= 3) {
        // Formato válido, pero aún no verificado en servidor
        setValidation(prev => ({
          ...prev,
          nombre_usuario: { loading: false, valid: null, message: '' }
        }));
      }
    } else if (name === 'email') {
      const emailValue = value ? value.trim() : value;
      // Solo validar formato mientras escribe
      if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        setValidation(prev => ({
          ...prev,
          email: { loading: false, valid: false, message: 'Formato de correo inválido' }
        }));
      } else if (emailValue) {
        // Formato válido, pero aún no verificado en servidor
        setValidation(prev => ({
          ...prev,
          email: { loading: false, valid: null, message: '' }
        }));
      }
    } else if (name === 'telefono') {
      // Formatear número de teléfono mientras se escribe
      const formattedPhone = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, p1, p2, p3) => {
          let result = p1;
          if (p2) result += ` ${p2}`;
          if (p3) result += ` ${p3}`;
          return result;
        });

      setFormData(prev => ({
        ...prev,
        telefono: formattedPhone
      }));

      const telefonoLimpio = formattedPhone.replace(/\s/g, '');
      if (!telefonoLimpio && !formData.esPromotor) {
        setValidation(prev => ({
          ...prev,
          telefono: { loading: false, valid: true, message: 'Opcional' }
        }));
      } else if (!telefonoLimpio && formData.esPromotor) {
        setValidation(prev => ({
          ...prev,
          telefono: { loading: false, valid: false, message: 'El teléfono es obligatorio para promotores' }
        }));
      } else if (!/^[67]\d{0,8}$/.test(telefonoLimpio)) {
        setValidation(prev => ({
          ...prev,
          telefono: { loading: false, valid: false, message: 'Formato de móvil español inválido (6/7...)' }
        }));
      } else if (telefonoLimpio.length === 9) {
        setValidation(prev => ({
          ...prev,
          telefono: { loading: false, valid: null, message: '' }
        }));
      }
    } else if (name === 'password') {
      validarPassword(value);
      // Si hay confirmación, validar también la coincidencia
      if (formData.confirmPassword) {
        validarConfirmPassword(formData.confirmPassword, value);
      }
    } else if (name === 'confirmPassword') {
      validarConfirmPassword(value, formData.password);
    } else if (name === 'esPromotor') {
      // Si se activa promotor, validar teléfono si existe
      if (checked && formData.telefono) {
        validarTelefono(formData.telefono);
      } else if (!checked) {
        // Si se desactiva promotor, resetear validación de teléfono
        setValidation(prev => ({
          ...prev,
          telefono: { loading: false, valid: true, message: 'Opcional' }
        }));
      }
    }
  };

  // --- MANEJADOR BLUR USUARIO ---
  const handleUsuarioBlur = () => {
    if (formData.nombre_usuario && formData.nombre_usuario.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.nombre_usuario)) {
      validarNombreUsuario(formData.nombre_usuario);
    }
  };

  // --- MANEJADOR BLUR EMAIL ---
  const handleEmailBlur = () => {
    const emailValue = formData.email ? formData.email.trim() : formData.email;
    if (emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      validarEmail(emailValue);
    }
  };

  // --- VALIDAR NOMBRE DE USUARIO ---
  const validarNombreUsuario = async (nombreUsuario) => {
    if (!nombreUsuario) {
      setValidation(prev => ({
        ...prev,
        nombre_usuario: { loading: false, valid: false, message: 'El nombre de usuario es obligatorio' }
      }));
      return false;
    }

    if (nombreUsuario.length < 3) {
      setValidation(prev => ({
        ...prev,
        nombre_usuario: { loading: false, valid: false, message: 'Mínimo 3 caracteres' }
      }));
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(nombreUsuario)) {
      setValidation(prev => ({
        ...prev,
        nombre_usuario: { loading: false, valid: false, message: 'Solo letras, números y guión bajo (_)' }
      }));
      return false;
    }

    // Verificación en servidor
    setValidation(prev => ({
      ...prev,
      nombre_usuario: { ...prev.nombre_usuario, loading: true, message: 'Verificando...' }
    }));

    try {
      const resultado = await usuariosService.verificarNombreUsuarioUnico(nombreUsuario);

      if (resultado.error) throw new Error(resultado.error);

      const existe = resultado.existe === true;

      setValidation(prev => ({
        ...prev,
        nombre_usuario: {
          loading: false,
          valid: !existe,
          message: existe ? 'Este nombre de usuario ya está en uso' : 'Nombre de usuario disponible'
        }
      }));

      return !existe;
    } catch (error) {
      console.error('Error validando nombre de usuario:', error);
      setValidation(prev => ({
        ...prev,
        nombre_usuario: {
          loading: false,
          valid: false,
          message: 'Error al verificar el nombre de usuario'
        }
      }));
      return false;
    }
  };

  // --- MANEJADOR TELÉFONO ---
  const handleTelefonoChange = (e) => {
    handleChange(e);
  };

  const handleTelefonoBlur = () => {
    const telefonoLimpio = formData.telefono ? formData.telefono.replace(/\s/g, '') : formData.telefono;

    if (!telefonoLimpio && !formData.esPromotor) return;
    if (!telefonoLimpio && formData.esPromotor) {
      validarTelefono('');
      return;
    }

    if (telefonoLimpio && /^[67]\d{8}$/.test(telefonoLimpio)) {
      validarTelefono(formData.telefono);
    }
  };

  // --- TOGGLE MOSTRAR PASSWORD ---
  const toggleMostrarPassword = () => {
    setShowPassword(!showPassword);
  };

  // --- VOLVER ---
  const handleVolver = () => {
    navigate(-1);
  };

  // --- VALIDAR EMAIL ---
  const validarEmail = async (email) => {
    const emailValue = email ? email.trim() : email;
    // Validación básica
    if (!emailValue) {
      setValidation(prev => ({
        ...prev,
        email: { loading: false, valid: false, message: 'El correo es obligatorio' }
      }));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setValidation(prev => ({
        ...prev,
        email: { loading: false, valid: false, message: 'Formato de correo inválido' }
      }));
      return false;
    }

    // Verificación en servidor
    setValidation(prev => ({
      ...prev,
      email: { ...prev.email, loading: true, message: 'Verificando...' }
    }));

    try {
      console.log(' Verificando email:', emailValue.toLowerCase());

      // Usar servicio centralizado
      const resultado = await usuariosService.verificarEmailUnico(emailValue);

      console.log(' Respuesta verificación email:', resultado);

      if (resultado.error) {
        throw new Error(resultado.error);
      }

      const existe = resultado.existe;

      setValidation(prev => ({
        ...prev,
        email: {
          loading: false,
          valid: !existe,
          message: existe ? 'Este correo ya está registrado' : 'Correo electrónico válido'
        }
      }));

      return !existe;
    } catch (error) {
      console.error('Error validando email:', error);
      setValidation(prev => ({
        ...prev,
        email: {
          loading: false,
          valid: false,
          message: 'Error al verificar el correo electrónico'
        }
      }));
      return false;
    }
  };

  // --- VALIDAR TELÉFONO ---
  const validarTelefono = async (telefono) => {
    const telefonoLimpio = telefono.replace(/\s/g, '');

    // Si no hay teléfono y no es promotor, es válido
    if (!telefonoLimpio && !formData.esPromotor) {
      setValidation(prev => ({
        ...prev,
        telefono: { loading: false, valid: true, message: 'Opcional' }
      }));
      return true;
    }

    // Si es promotor y no hay teléfono, es inválido
    if (formData.esPromotor && !telefonoLimpio) {
      setValidation(prev => ({
        ...prev,
        telefono: { loading: false, valid: false, message: 'El teléfono es obligatorio para promotores' }
      }));
      return false;
    }

    // Validación de formato
    if (!/^[67]\d{8}$/.test(telefonoLimpio)) {
      setValidation(prev => ({
        ...prev,
        telefono: { loading: false, valid: false, message: 'Formato de móvil español inválido (6/7 seguido de 8 dígitos)' }
      }));
      return false;
    }

    // Verificación en servidor
    setValidation(prev => ({
      ...prev,
      telefono: { ...prev.telefono, loading: true, message: 'Verificando...' }
    }));

    try {
      const resultado = await usuariosService.verificarTelefonoUnico(telefonoLimpio);

      if (resultado.error) throw new Error(resultado.error);

      const existe = resultado.existe === true;

      setValidation(prev => ({
        ...prev,
        telefono: {
          loading: false,
          valid: !existe,
          message: existe ? 'Este teléfono ya está registrado' : 'Teléfono válido'
        }
      }));

      return !existe;
    } catch (error) {
      console.error('Error validando teléfono:', error);
      setValidation(prev => ({
        ...prev,
        telefono: {
          loading: false,
          valid: false,
          message: 'Error al verificar el teléfono'
        }
      }));
      return false;
    }
  };

  // --- VALIDAR CONTRASEÑA ---
  const validarPassword = (password) => {
    if (!password) {
      setValidation(prev => ({
        ...prev,
        password: { valid: false, message: 'La contraseña es obligatoria' }
      }));
      return false;
    }

    if (password.length < 8) {
      setValidation(prev => ({
        ...prev,
        password: { valid: false, message: 'Mínimo 8 caracteres' }
      }));
      return false;
    }

    setValidation(prev => ({
      ...prev,
      password: { valid: true, message: 'Contraseña válida' }
    }));
    return true;
  };

  // --- VALIDAR CONFIRMACIÓN DE CONTRASEÑA ---
  const validarConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      setValidation(prev => ({
        ...prev,
        confirmPassword: { valid: false, message: 'Confirma tu contraseña' }
      }));
      return false;
    }

    if (confirmPassword !== password) {
      setValidation(prev => ({
        ...prev,
        confirmPassword: { valid: false, message: 'Las contraseñas no coinciden' }
      }));
      return false;
    }

    setValidation(prev => ({
      ...prev,
      confirmPassword: { valid: true, message: 'Contraseña confirmada' }
    }));
    return true;
  };

  // --- ENVIAR FORMULARIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validar campos básicos
      const newErrors = {};
      if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
      if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';

      // Ejecutar validaciones asíncronas
      const isUsernameValid = await validarNombreUsuario(formData.nombre_usuario);
      const isEmailValid = await validarEmail(formData.email);
      const isPasswordValid = validarPassword(formData.password);
      const isConfirmPasswordValid = validarConfirmPassword(formData.confirmPassword, formData.password);

      // Validar teléfono (obligatorio para promotores)
      let isPhoneValid = true;
      if (formData.esPromotor) {
        isPhoneValid = await validarTelefono(formData.telefono);
      } else if (formData.telefono && formData.telefono.replace(/\s/g, '').length > 0) {
        isPhoneValid = await validarTelefono(formData.telefono);
      }

      // Si hay errores, mostrarlos y detener el envío
      if (Object.keys(newErrors).length > 0 ||
        !isUsernameValid ||
        !isEmailValid ||
        !isPasswordValid ||
        !isConfirmPasswordValid ||
        !isPhoneValid) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para el servidor
      const telefonoLimpio = formData.telefono ? formData.telefono.replace(/\s/g, '') : null;

      const userData = {
        nombre_usuario: formData.nombre_usuario.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        telefono: telefonoLimpio,
        telefono_verificado: false,
        password: formData.password,
        tipo_usuario: formData.esPromotor ? 'promotor' : 'cliente'
      };

      // Enviar datos al servidor para verificación de email
      const response = await fetch('http://localhost:3001/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userData.email, userData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el código de verificación');
      }

      // Redirigir a la página de verificación de email
      navigate('/VerificacionEmail', {
        state: {
          ...userData,
          redirectTo: formData.esPromotor ? '/promotor/dashboard' : '/usuario/dashboard'
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({
        general: error.message || 'Error inesperado. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header theme={theme} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem', backgroundColor: bgColor }}>
        <div style={{ width: '100%', maxWidth: '500px', backgroundColor: colors.surfaceColor, borderRadius: '14px', padding: '2rem', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: `1px solid ${colors.borderColor}` }}>

          {/* Título */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'Roboto, serif', fontSize: '1.75rem', fontWeight: 700, color: colors.primaryColor, margin: '0 0 0.5rem 0' }}>
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
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
                    border: `1px solid ${validation.nombre_usuario.valid === false ? errorColor : validation.nombre_usuario.valid === true ? successColor : borderColor}`,
                    borderRadius: '8px',
                    color: textColor,
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="juanperez"
                  disabled={isSubmitting || validandoUsuario}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: mutedColor, fontSize: '0.9rem', fontWeight: 500 }}>
                  @
                </span>
              </div>
              <div style={{ marginTop: '0.25rem', minHeight: '1.2rem' }}>
                {validation.nombre_usuario.loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: primaryColor, fontSize: '0.75rem' }}>
                    ⏳ Verificando disponibilidad...
                  </span>
                ) : validation.nombre_usuario.valid === true ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: successColor, fontSize: '0.75rem' }}>
                    ✅ {validation.nombre_usuario.message}
                  </span>
                ) : validation.nombre_usuario.valid === false ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: errorColor, fontSize: '0.75rem' }}>
                    ❌ {validation.nombre_usuario.message}
                  </span>
                ) : (
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
                onBlur={handleEmailBlur}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${validation.email.valid === false ? errorColor : validation.email.valid === true ? successColor : borderColor}`,
                  borderRadius: '8px',
                  color: textColor,
                  fontSize: '1rem',
                  fontFamily: 'Roboto, sans-serif',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
              <div style={{ marginTop: '0.25rem', minHeight: '1.2rem' }}>
                {validation.email.loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: primaryColor, fontSize: '0.75rem' }}>
                    ⏳ Verificando disponibilidad...
                  </span>
                ) : validation.email.valid === true ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: successColor, fontSize: '0.75rem' }}>
                    ✅ {validation.email.message}
                  </span>
                ) : validation.email.valid === false ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: errorColor, fontSize: '0.75rem' }}>
                    ❌ {validation.email.message}
                  </span>
                ) : (
                  <span style={{ display: 'block', color: mutedColor, fontSize: '0.7rem' }}>
                    Introduce tu correo electrónico
                  </span>
                )}
              </div>
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
                  color: colors.mutedColor,
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
                  onBlur={handleTelefonoBlur}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: theme === 'night' ? '#0F172A' : '#F8FAFC',
                    border: `1px solid ${errors.telefono ? errorColor : validation.telefono.valid === false ? errorColor : validation.telefono.valid === true ? successColor : borderColor}`,
                    borderRadius: '8px',
                    color: colors.mutedColor,
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
                  validation.telefono.loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: primaryColor, fontSize: '0.75rem' }}>
                      ⏳ Verificando...
                    </span>
                  ) : validation.telefono.valid === true ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: successColor, fontSize: '0.75rem' }}>
                      ✅ {validation.telefono.message}
                    </span>
                  ) : validation.telefono.valid === false ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: errorColor, fontSize: '0.75rem' }}>
                      ❌ {validation.telefono.message}
                    </span>
                  ) : (
                    <span style={{ display: 'block', color: mutedColor, fontSize: '0.7rem' }}>
                      {formData.esPromotor ? 'Obligatorio para promotores' : 'Opcional para clientes'} • 9 dígitos • Móvil español (6xx, 7xx)
                    </span>
                  )
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
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? '🙈' : '👁️'}
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
                  type={showPassword ? "text" : "password"}
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