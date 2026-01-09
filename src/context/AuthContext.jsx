// src/context/AuthContext.jsx - Versión con generación de código de verificación
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

// Función para generar código de verificación único (6 dígitos)
const generarCodigoVerificacion = (telefono) => {
  const hoy = new Date();

  // 1. Teléfono completo como número
  const telefonoCompleto = parseInt(telefono.replace(/\D/g, ''));

  // 2. Partes del teléfono
  const soloDigitos = telefono.replace(/\D/g, '');
  const primeros3 = parseInt(soloDigitos.slice(0, 3));
  const ultimos3 = parseInt(soloDigitos.slice(-3));

  // 3. Fecha
  const dia = hoy.getDate();           // 19
  const mes = hoy.getMonth() + 1;      // 12
  const anio = hoy.getFullYear() % 100; // 25

  // 4. Algoritmo: (primeros3 * dia) + (ultimos3 * mes) + (telefonoCompleto * anio)
  const codigoNum = (
    (primeros3 * dia) +
    (ultimos3 * mes) +
    (telefonoCompleto * anio)
  );

  // 5. Tomar últimos 6 dígitos
  const codigoStr = codigoNum.toString();
  const codigoFinal = codigoStr.length > 6
    ? codigoStr.slice(-6)
    : codigoStr.padStart(6, '0');

  console.log('🔐 Código de verificación generado:', {
    telefono,
    fecha: `${dia}/${mes}/${anio}`,
    codigoFinal,
    formula: `(${primeros3} * ${dia}) + (${ultimos3} * ${mes}) + (${telefonoCompleto} * ${anio}) = ${codigoNum} → últimos 6 dígitos: ${codigoFinal}`
  });

  return codigoFinal;
};

// Función para normalizar nombres de redes sociales
const normalizarNombreRed = (nombreInput) => {
  const nombre = nombreInput.toLowerCase().trim();

  const normalizaciones = {
    // WhatsApp
    'wasa': 'whatsapp', 'whats': 'whatsapp', 'whatsapp': 'whatsapp', 'wa': 'whatsapp',
    // Instagram
    'insta': 'instagram', 'ig': 'instagram', 'instagram': 'instagram',
    // Facebook
    'fb': 'facebook', 'facebook': 'facebook', 'face': 'facebook',
    // Twitter/X
    'twitter': 'twitter', 'x': 'twitter', 'tw': 'twitter',
    // TikTok
    'tiktok': 'tiktok', 'tik tok': 'tiktok', 'tt': 'tiktok',
    // YouTube
    'youtube': 'youtube', 'yt': 'youtube', 'you tube': 'youtube',
    // LinkedIn
    'linkedin': 'linkedin', 'linked in': 'linkedin', 'ln': 'linkedin',
    // Telegram
    'telegram': 'telegram', 'tg': 'telegram', 'tl': 'telegram',
    // Pinterest
    'pinterest': 'pinterest', 'pin': 'pinterest',
    // Snapchat
    'snapchat': 'snapchat', 'snap': 'snapchat',
    // Spotify
    'spotify': 'spotify', 'spoti': 'spotify',
    // Twitch
    'twitch': 'twitch', 'twch': 'twitch',
  };

  const normalizado = normalizaciones[nombre];
  console.log('🔤 Normalización red social:', { input: nombreInput, normalizado: normalizado || nombre });
  return normalizado || nombre;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Si no hay contexto, devolvemos valores por defecto
    return {
      user: null,
      login: () => ({ success: false }),
      logout: () => { },
      quickRegister: async () => ({ success: false, error: 'Contexto no disponible' }),
      verificarCodigoEmail: async () => ({ success: false, error: 'Contexto no disponible' }),
      obtenerRedesSociales: async () => ({ success: false, error: 'Contexto no disponible', redes: [] }),
      agregarRedSocial: async () => ({ success: false, error: 'Contexto no disponible' }),
      eliminarRedSocial: async () => ({ success: false, error: 'Contexto no disponible' }),
      isAuthenticated: false
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar usuario de sessionStorage al iniciar
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  // --- LOGIN REAL (SUPABASE) ---
  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login para:', email);

      // 1. Iniciar sesión directamente con Supabase Auth (Email)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        console.error('❌ Error en login Supabase:', authError);
        return { success: false, message: 'Email o contraseña incorrectos' };
      }

      // 3. Obtener datos completos del perfil público (Selección explícita)
      const { data: dbProfile, error: profileError } = await supabase
        .from('usuarios')
        .select('id, nombre_usuario, email, telefono, telefono_verificado, tipo, nombre, apellidos, calle, numero, ciudad, provincia, codigo_postal, avatar_url, updated_at')
        .eq('id', authData.user.id)
        .single();

      let publicProfile = dbProfile;

      if (profileError) {
        console.error('⚠️ Error obteniendo perfil público:', profileError);
        console.error('⚠️ No se pudo cargar el perfil completo. Usando datos mínimos de Auth.');
        // Continuar con datos mínimos si falla
        publicProfile = {
          id: authData.user.id,
          email: authData.user.email,
          nombre_usuario: authData.user.user_metadata?.nombre_usuario,
          tipo: authData.user.user_metadata?.tipo
        };
      }

      // 4. Construir objeto de usuario unificado
      const db = publicProfile?.datos_negocio || {};
      const finalUser = {
        id: authData.user.id,
        email: authData.user.email,
        ...publicProfile,
        // Prioridad a datos públicos y normalización
        nombre_usuario: publicProfile?.nombre_usuario || authData.user.user_metadata?.nombre_usuario || authData.user.user_metadata?.username,
        nombre: db.nombre || publicProfile?.nombre || authData.user.user_metadata?.nombre,
        apellidos: db.apellidos || publicProfile?.apellidos || authData.user.user_metadata?.apellidos,
        tipo: publicProfile?.tipo || authData.user.user_metadata?.tipo,
        telefono: publicProfile?.telefono || authData.user.user_metadata?.telefono,
        telefono_verificado: publicProfile?.telefono_verificado || false,
        avatar_url: db.avatar_url || publicProfile?.avatar_url || ''
      };

      setUser(finalUser);
      sessionStorage.setItem('user', JSON.stringify(finalUser));
      console.log('✅ Login exitoso:', finalUser);

      return { success: true, user: finalUser };

    } catch (error) {
      console.error('💥 Excepción en login:', error);
      return { success: false, message: error.message || 'Error inesperado al iniciar sesión' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  // FUNCIÓN: Verificar código de email
  const verificarCodigoEmail = async (userId, codigoIngresado) => {
    try {
      console.log('🔍 Verificando código:', { userId, codigoIngresado });

      // 1. Obtener usuario de la base de datos
      const { data: usuarioDB, error: usuarioError } = await supabase
        .from('usuarios')
        .select('codigo_verificacion')
        .eq('id', userId)
        .single();

      if (usuarioError) {
        console.error('❌ Error obteniendo usuario:', usuarioError);
        return {
          success: false,
          error: 'Usuario no encontrado en la base de datos'
        };
      }

      // 2. Verificar si ya está verificado (Si no hay código, asumimos verificado o flujo completado)
      if (!usuarioDB.codigo_verificacion) {
        return {
          success: true,
          yaVerificado: true,
          message: 'El email ya está verificado o no requiere código'
        };
      }

      // 3. Verificar código
      if (!usuarioDB.codigo_verificacion) {
        return {
          success: false,
          error: 'No hay código de verificación pendiente'
        };
      }

      if (usuarioDB.codigo_verificacion !== codigoIngresado) {
        return {
          success: false,
          error: 'Código incorrecto'
        };
      }

      // 4. Actualizar usuario: Limpiar código usado
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          codigo_verificacion: null, // Limpiar código usado
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error actualizando verificación:', updateError);
        return {
          success: false,
          error: 'Error al actualizar verificación'
        };
      }

      console.log('✅ Email verificado exitosamente para usuario:', userId);

      // 5. Actualizar usuario local si es el mismo
      if (user && user.id === userId) {
        const updatedUser = { ...user };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return {
        success: true,
        message: 'Email verificado correctamente'
      };

    } catch (error) {
      console.error('💥 Error en verificarCodigoEmail:', error);
      return {
        success: false,
        error: error.message || 'Error desconocido en verificación'
      };
    }
  };

  // ========== FUNCIONES REDES SOCIALES ==========

  // FUNCIÓN: Obtener redes sociales de un propietario
  const obtenerRedesSociales = async (propietario_id, tipo_propietario) => {
    try {
      console.log('🔍 Obteniendo redes sociales para:', { propietario_id, tipo_propietario });

      const { data, error } = await supabase
        .from('redes_sociales')
        .select('*')
        .eq('propietario_id', propietario_id)
        .eq('tipo_propietario', tipo_propietario)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo redes sociales:', error);
        return { success: false, error: error.message, redes: [] };
      }

      console.log(`✅ ${data?.length || 0} redes sociales obtenidas`);
      return { success: true, redes: data || [] };

    } catch (error) {
      console.error('💥 Error en obtenerRedesSociales:', error);
      return { success: false, error: error.message, redes: [] };
    }
  };

  // FUNCIÓN: Añadir nueva red social
  const agregarRedSocial = async (redData) => {
    try {
      console.log('➕ Añadiendo red social:', redData);

      // Normalizar tipo_red
      const tipoRedNormalizado = normalizarNombreRed(redData.tipo_red);

      const redCompleta = {
        ...redData,
        tipo_red: tipoRedNormalizado,
        created_at: new Date().toISOString(),
        es_principal: redData.es_principal || false
      };

      const { data, error } = await supabase
        .from('redes_sociales')
        .insert([redCompleta])
        .select()
        .single();

      if (error) {
        console.error('❌ Error añadiendo red social:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Red social añadida:', data);
      return { success: true, red: data };

    } catch (error) {
      console.error('💥 Error en agregarRedSocial:', error);
      return { success: false, error: error.message };
    }
  };

  // FUNCIÓN: Eliminar red social
  const eliminarRedSocial = async (redId) => {
    try {
      console.log('🗑️ Eliminando red social ID:', redId);

      const { error } = await supabase
        .from('redes_sociales')
        .delete()
        .eq('id', redId);

      if (error) {
        console.error('❌ Error eliminando red social:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Red social eliminada');
      return { success: true };

    } catch (error) {
      console.error('💥 Error en eliminarRedSocial:', error);
      return { success: false, error: error.message };
    }
  };

  // ========== FIN FUNCIONES REDES SOCIALES ==========

  // FUNCIÓN MODIFICADA: quickRegister ahora genera y guarda código de verificación
  const quickRegister = async (userData) => {
    try {
      console.log('🚀 quickRegister iniciado con:', {
        email: userData.email,
        nombre_usuario: userData.nombre_usuario,
        tipo: userData.tipo,
        telefono: userData.telefono
      });

      // 1. Generar código de verificación
      const codigoVerificacion = generarCodigoVerificacion(userData.telefono);
      console.log('📧 Código de verificación generado:', codigoVerificacion);

      // 2. Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        phone: userData.telefono_completo,
        options: {
          data: {
            nombre_usuario: userData.nombre_usuario,
            nombre: userData.nombre,
            apellidos: userData.apellidos,
            telefono: userData.telefono,
            tipo: userData.tipo,
            prefijo_telefono: userData.prefijo_telefono,
            codigo_verificacion: codigoVerificacion // Enviar en metadata
          }
        }
      });

      if (authError) {
        console.error('❌ Error en Supabase Auth signUp:', authError);
        return {
          success: false,
          error: authError.message,
          details: 'Error al crear usuario en sistema de autenticación'
        };
      }

      console.log('✅ Usuario creado en Auth:', authData.user?.id);

      // 3. Esperar 1 segundo para dar tiempo a los triggers
      console.log('⏳ Esperando triggers de Supabase...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Verificar que el usuario existe en la tabla 'usuarios' y actualizar código
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            codigo_verificacion: codigoVerificacion,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.warn('⚠️ No se pudo guardar código en usuarios (puede ser normal):', updateError);
          // No es fatal - puede que los triggers aún no hayan creado el registro
        } else {
          console.log('✅ Código de verificación guardado en tabla usuarios:', codigoVerificacion);
        }

        // 5. SIMULAR ENVÍO DE EMAIL (por ahora - luego con Twilio)
        console.log('📤 SIMULACIÓN ENVÍO EMAIL:');
        console.log('──────────────────────────────');
        console.log(`Para: ${userData.email}`);
        console.log(`Asunto: Verifica tu email en EstaNoche.es`);
        console.log(`Cuerpo:`);
        console.log(`Hola ${userData.nombre},`);
        console.log(`Para completar tu registro en EstaNoche.es, introduce este código:`);
        console.log(`🔐 ${codigoVerificacion}`);
        console.log(`El código es válido por 24 horas.`);
        console.log(`Si no solicitaste este registro, ignora este email.`);
        console.log('──────────────────────────────');

        // TODO: Implementar con Twilio SendGrid
        // await enviarEmailVerificacion(userData.email, userData.nombre, codigoVerificacion);
      }

      // 6. Crear objeto de usuario para estado local (Consistente con login)
      const localUserData = {
        id: authData.user?.id,
        nombre_usuario: userData.nombre_usuario,
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        email: userData.email,
        tipo: userData.tipo,
        telefono: userData.telefono_completo || userData.telefono,
        prefijo_telefono: userData.prefijo_telefono,
        codigo_verificacion: codigoVerificacion
      };

      // 7. Actualizar estado y sessionStorage
      setUser(localUserData);
      sessionStorage.setItem('user', JSON.stringify(localUserData));

      console.log('🎉 Registro completado exitosamente');
      console.log('📋 Código de verificación para el usuario:', codigoVerificacion);

      return {
        success: true,
        user: localUserData,
        authUser: authData.user,
        session: authData.session,
        codigoVerificacion: codigoVerificacion // Retornar para debugging
      };

    } catch (error) {
      console.error('💥 Error crítico en quickRegister:', error);
      return {
        success: false,
        error: error.message || 'Error desconocido en el registro',
        details: 'Excepción no manejada en el proceso de registro'
      };
    }
  };

  // FUNCIÓN: Mejorar cuenta a promotor
  const upgradeToPromoter = async (userId) => {
    try {
      console.log('🚀 Iniciando mejora a promotor para:', userId);

      // Usar endpoint relativo (funciona en local con proxy y en Vercel)
      const response = await fetch('/api/upgrade-promoter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Error parseando respuesta del servidor:', responseText);
        return { success: false, error: 'Respuesta inválida del servidor: ' + responseText.slice(0, 100) };
      }

      if (!data.success) {
        console.error('❌ Error actualizando a promotor (API):', data.error);
        return { success: false, error: data.error };
      }

      console.log('✅ Upgrade API exitoso. Actualizando estado local...');

      // Actualizar estado local
      if (user && user.id === userId) {
        const updatedUser = { ...user, tipo: 'promotor' };
        console.log('🔄 Seteando nuevo usuario local:', updatedUser);
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        console.error('⚠️ User mismatch o user null en AuthContext:', { contextUser: user, paramId: userId });
        return { success: false, error: 'User state mismatch' };
      }
    } catch (error) {
      console.error('💥 Error en upgradeToPromoter:', error);
      return { success: false, error: error.message };
    }
  };
  // FUNCIÓN: Downgrade a Cliente (si rechaza validar teléfono)
  const downgradeToClient = async (userId) => {
    try {
      console.log('📉 Iniciando downgrade a cliente para:', userId);

      const { error } = await supabase
        .from('usuarios')
        .update({
          tipo: 'cliente',
          tipo_usuario: 'cliente', // Por si acaso usa este campo también
          telefono_verificado: false
        })
        .eq('id', userId);

      if (error) {
        console.error('❌ Error haciendo downgrade (Supabase):', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Downgrade exitoso. Actualizando estado local...');

      if (user && user.id === userId) {
        const updatedUser = { ...user, tipo: 'cliente', telefono_verificado: false };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: true, warning: 'Usuario local no sincronizado' };
      }

    } catch (error) {
      console.error('💥 Error en downgradeToClient:', error);
      return { success: false, error: error.message };
    }
  };

  // Permite iniciar sesión manualmente con datos ya verificados (ej: desde VerificacionEmail)
  const loginManual = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const value = {
    user,
    login,
    loginManual,
    logout,
    quickRegister,
    verificarCodigoEmail,
    upgradeToPromoter,
    downgradeToClient, // <--- Nueva función
    obtenerRedesSociales,
    agregarRedSocial,
    eliminarRedSocial,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};