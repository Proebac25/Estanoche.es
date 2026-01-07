// src/services/usuariosService.js
import { supabase } from '../lib/supabase';

const coerceRpcBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === 't' || v === '1') return true;
    if (v === 'false' || v === 'f' || v === '0') return false;
  }
  return null;
};

/**
 * SERVICIO DE USUARIOS
 * Gestiona todas las operaciones relacionadas con usuarios en Supabase
 */

export const usuariosService = {
  
  // ========== VERIFICACIONES DE UNICIDAD ==========
  
  /**
   * Verificar si un nombre de usuario ya existe (usando RPC)
   */
  verificarNombreUsuarioUnico: async (nombreUsuario) => {
    try {
      const { data, error } = await supabase
        .rpc('nombre_usuario_existe', { 
          nombre_usuario_buscar: nombreUsuario.toLowerCase().trim() 
        });

      console.log('👤 RPC nombre_usuario_existe:', { data, error, tipo: typeof data });

      if (error) {
        console.error('Error RPC nombre_usuario_existe:', error);
        return { existe: false, error: error.message };
      }

      const existe = coerceRpcBoolean(data);
      if (existe === null) {
        return { existe: false, error: 'Respuesta inválida del servidor (RPC nombre_usuario_existe)' };
      }

      return { 
        existe,
        mensaje: existe ? 'Este nombre de usuario ya está en uso' : null 
      };
    } catch (error) {
      console.error('Excepción verificando nombre usuario:', error);
      return { existe: false, error: 'Error de conexión' };
    }
  },

  /**
   * Verificar si un email ya existe (usando RPC)
   */
  verificarEmailUnico: async (email) => {
    try {
      const { data, error } = await supabase
        .rpc('email_existe', { 
          email_buscar: email.toLowerCase().trim() 
        });

      console.log('📧 RPC email_existe:', { data, error, tipo: typeof data });

      if (error) {
        console.error('Error RPC email_existe:', error);
        return { existe: false, error: error.message };
      }

      const existe = coerceRpcBoolean(data);
      if (existe === null) {
        return { existe: false, error: 'Respuesta inválida del servidor (RPC email_existe)' };
      }

      return { 
        existe,
        mensaje: existe ? 'Este email ya está registrado' : null 
      };
    } catch (error) {
      console.error('Excepción verificando email:', error);
      return { existe: false, error: 'Error verificando email' };
    }
  },

  /**
   * Verificar si un teléfono ya existe (usando RPC)
   */
  verificarTelefonoUnico: async (telefonoCompleto) => {
    try {
      if (!telefonoCompleto || telefonoCompleto.trim() === '') {
        return { existe: false, mensaje: null };
      }
      
      const telefonoSoloNumeros = telefonoCompleto.replace(/\D/g, '');
      
      const { data, error } = await supabase
        .rpc('telefono_existe', { 
          telefono_buscar: telefonoSoloNumeros 
        });

      console.log('📱 RPC telefono_existe:', { data, error, tipo: typeof data });

      if (error) {
        console.error('Error RPC telefono_existe:', error);
        return { existe: false, error: 'Error verificando teléfono' };
      }

      const existe = coerceRpcBoolean(data);
      if (existe === null) {
        return { existe: false, error: 'Respuesta inválida del servidor (RPC telefono_existe)' };
      }

      return { 
        existe,
        mensaje: existe ? 'El teléfono ya está registrado' : null 
      };
    } catch (error) {
      console.error('Excepción verificando teléfono:', error);
      return { existe: false, error: 'Error de conexión' };
    }
  },

  // ========== CRUD USUARIOS ==========

  /**
   * Crear un nuevo usuario en Supabase Auth y tabla usuarios
   */
  crearUsuario: async (userData) => {
    try {
      console.log('📝 Creando usuario:', userData);
      
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nombre_usuario: userData.nombre_usuario,
            nombre: userData.nombre,
            apellidos: userData.apellidos,
            telefono: userData.telefono || null
          }
        }
      });

      if (authError) {
        console.error('❌ Error en Supabase Auth:', authError);
        return { 
          success: false, 
          error: authError.message,
          user: null 
        };
      }

      console.log('✅ Usuario creado en Auth:', authData.user?.id);

      // 2. Crear registro en tabla usuarios
      const usuarioData = {
        id: authData.user.id,
        nombre_usuario: userData.nombre_usuario,
        email: userData.email,
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        telefono: userData.telefono || null,
        telefono_completo: userData.telefono_completo || null,
        prefijo_telefono: userData.prefijo_telefono || null,
        tipo: userData.tipo || 'cliente_pendiente',
        emailValidado: false,
        telefono_verificado: false,
        creado_en: new Date().toISOString()
      };

      const { data: usuarioDb, error: dbError } = await supabase
        .from('usuarios')
        .insert([usuarioData])
        .select()
        .single();

      if (dbError) {
        console.error('❌ Error insertando en tabla usuarios:', dbError);
        // Intentar eliminar el usuario de Auth si falla la BD
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { 
          success: false, 
          error: `Error en base de datos: ${dbError.message}`,
          user: null 
        };
      }

      console.log('✅ Usuario creado en tabla usuarios:', usuarioDb.id);

      return {
        success: true,
        user: {
          ...authData.user,
          ...usuarioDb
        },
        message: 'Usuario creado exitosamente'
      };

    } catch (error) {
      console.error('❌ Excepción en crearUsuario:', error);
      return {
        success: false,
        error: error.message || 'Error inesperado creando usuario',
        user: null
      };
    }
  },

  /**
   * Obtener un usuario por ID
   */
  obtenerUsuario: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error obteniendo usuario:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Excepción obteniendo usuario:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Actualizar datos de usuario
   */
  actualizarUsuario: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando usuario:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Excepción actualizando usuario:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ========== VERIFICACIÓN EMAIL ==========
  
  /**
   * Generar código de verificación de 6 dígitos
   */
  generarCodigoVerificacion: async (email, userId) => {
    try {
      // Algoritmo: (primeros3 * dia) + (ultimos3 * mes) + (telefono * año)
      const hoy = new Date();
      const dia = hoy.getDate();
      const mes = hoy.getMonth() + 1;
      const año = hoy.getFullYear();
      
      // Usar userId como semilla si no hay teléfono
      const semilla = userId || email;
      const hash = semilla.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      const codigoNumerico = (hash * dia) + (hash * mes) + (hash * año);
      const codigo6Digitos = codigoNumerico.toString().slice(-6).padStart(6, '0');
      
      console.log(`📧 Código generado para ${email}: ${codigo6Digitos}`);
      
      // Guardar código en la base de datos
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ 
          codigo_verificacion: codigo6Digitos,
          codigo_generado_en: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (updateError) {
        console.error('Error guardando código de verificación:', updateError);
        return { success: false, error: updateError.message, codigo: null };
      }

      // En producción: enviar email real
      // Por ahora solo log
      console.log(`📨 Email simulado enviado a ${email} con código: ${codigo6Digitos}`);

      return {
        success: true,
        codigo: codigo6Digitos,
        message: 'Código generado y guardado'
      };

    } catch (error) {
      console.error('Excepción generando código:', error);
      return { success: false, error: error.message, codigo: null };
    }
  },

  /**
   * Verificar código de email
   */
  verificarCodigoEmail: async (email, codigoIngresado) => {
    try {
      // Obtener usuario y código guardado
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, codigo_verificacion, codigo_generado_en')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        console.error('Error obteniendo código de verificación:', error);
        return { success: false, error: 'Usuario no encontrado', valido: false };
      }

      if (!data.codigo_verificacion) {
        return { success: false, error: 'No hay código de verificación', valido: false };
      }

      // Verificar si el código ha expirado (24 horas)
      const generadoEn = new Date(data.codigo_generado_en);
      const ahora = new Date();
      const horasTranscurridas = (ahora - generadoEn) / (1000 * 60 * 60);
      
      if (horasTranscurridas > 24) {
        return { success: false, error: 'El código ha expirado', valido: false };
      }

      // Comparar códigos
      const esValido = data.codigo_verificacion === codigoIngresado;

      if (esValido) {
        // Marcar email como verificado
        await supabase
          .from('usuarios')
          .update({ 
            emailValidado: true,
            codigo_verificacion: null, // Limpiar código usado
            codigo_generado_en: null
          })
          .eq('id', data.id);
      }

      return {
        success: true,
        valido: esValido,
        message: esValido ? 'Email verificado correctamente' : 'Código incorrecto',
        userId: data.id
      };

    } catch (error) {
      console.error('Excepción verificando código:', error);
      return { success: false, error: error.message, valido: false };
    }
  },

  /**
   * Marcar email como verificado
   */
  marcarEmailVerificado: async (userId) => {
    return await usuariosService.actualizarUsuario(userId, {
      emailValidado: true,
      codigo_verificacion: null,
      codigo_generado_en: null
    });
  },

  // ========== GESTIÓN PROMOTOR/CLIENTE ==========
  
  /**
   * Cambiar usuario a tipo promotor
   */
  cambiarATipoPromotor: async (userId) => {
    return await usuariosService.actualizarUsuario(userId, {
      tipo: 'promotor',
      estado_profesional: 'activo'
    });
  },

  /**
   * Cambiar usuario a tipo cliente
   */
  cambiarATipoCliente: async (userId) => {
    return await usuariosService.actualizarUsuario(userId, {
      tipo: 'cliente'
    });
  },

  /**
   * Obtener todos los usuarios (solo para admin)
   */
  obtenerTodosUsuarios: async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error) {
        console.error('Error obteniendo usuarios:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Excepción obteniendo usuarios:', error);
      return { success: false, error: error.message, data: null };
    }
  }
};