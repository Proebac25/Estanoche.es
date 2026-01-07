// src/lib/authService.js
import { supabase } from './supabase';

/**
 * SERVICIO DE AUTENTICACIÓN PURA
 * Maneja solo operaciones de Supabase Auth
 */
export const authService = {
  
  /**
   * Registrar usuario con email y contraseña
   */
  registrarConEmailPassword: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            ...metadata,
            creado_en: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('❌ Error en registro Auth:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Usuario registrado en Auth:', data.user?.id);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción en registro Auth:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Iniciar sesión con email y contraseña
   */
  iniciarSesion: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password
      });

      if (error) {
        console.error('❌ Error iniciando sesión:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Sesión iniciada:', data.user?.id);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción iniciando sesión:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Cerrar sesión
   */
  cerrarSesion: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error cerrando sesión:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Sesión cerrada');
      return { success: true, error: null };

    } catch (error) {
      console.error('❌ Excepción cerrando sesión:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener sesión actual
   */
  obtenerSesionActual: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error obteniendo sesión:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo sesión:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Obtener usuario actual
   */
  obtenerUsuarioActual: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Error obteniendo usuario:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo usuario:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Enviar email de recuperación de contraseña
   */
  recuperarPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        console.error('❌ Error recuperando password:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Email de recuperación enviado a:', email);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción recuperando password:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Actualizar contraseña
   */
  actualizarPassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Error actualizando password:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Contraseña actualizada');
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción actualizando password:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Actualizar datos del usuario en Auth
   */
  actualizarUsuarioAuth: async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) {
        console.error('❌ Error actualizando usuario Auth:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Usuario Auth actualizado');
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción actualizando usuario Auth:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Verificar si hay sesión activa
   */
  tieneSesionActiva: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error('❌ Excepción verificando sesión:', error);
      return false;
    }
  }
};