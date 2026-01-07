// src/lib/entidadesService.js
import { supabase } from './supabase';

/**
 * SERVICIO DE ENTIDADES
 * Gestiona todas las operaciones relacionadas con entidades
 */
export const entidadesService = {
  
  // ========== CRUD BÁSICO ==========
  
  /**
   * Crear una nueva entidad
   */
  crearEntidad: async (entidadData, usuarioId) => {
    try {
      const entidadCompleta = {
        ...entidadData,
        creado_por: usuarioId,
        creado_en: new Date().toISOString(),
        estado: 'pendiente', // pendiente, activa, rechazada, inactiva
        visibilidad: 'publica' // publica, privada, oculta
      };

      const { data, error } = await supabase
        .from('entidades')
        .insert([entidadCompleta])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      // Crear relación usuario-entidad como admin
      const relacion = {
        usuario_id: usuarioId,
        entidad_id: data.id,
        rol: 'admin', // admin, editor, lector
        creado_en: new Date().toISOString()
      };

      const { error: errorRelacion } = await supabase
        .from('relaciones_entidades')
        .insert([relacion]);

      if (errorRelacion) {
        console.error('❌ Error creando relación:', errorRelacion);
        // Revertir creación de entidad
        await supabase.from('entidades').delete().eq('id', data.id);
        return { success: false, error: errorRelacion.message, data: null };
      }

      console.log('✅ Entidad creada:', data.id);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción creando entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Obtener entidad por ID
   */
  obtenerEntidad: async (entidadId) => {
    try {
      const { data, error } = await supabase
        .from('entidades')
        .select('*')
        .eq('id', entidadId)
        .single();

      if (error) {
        console.error('❌ Error obteniendo entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Obtener todas las entidades de un usuario
   */
  obtenerEntidadesPorUsuario: async (usuarioId, rol = null) => {
    try {
      let query = supabase
        .from('relaciones_entidades')
        .select(`
          rol,
          entidad:entidades(*)
        `)
        .eq('usuario_id', usuarioId);

      if (rol) {
        query = query.eq('rol', rol);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error obteniendo entidades del usuario:', error);
        return { success: false, error: error.message, data: null };
      }

      // Extraer solo las entidades
      const entidades = data.map(item => ({
        ...item.entidad,
        rol_usuario: item.rol
      }));

      return { success: true, data: entidades, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo entidades del usuario:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Obtener todas las entidades públicas
   */
  obtenerEntidadesPublicas: async (filtros = {}) => {
    try {
      let query = supabase
        .from('entidades')
        .select('*')
        .eq('visibilidad', 'publica')
        .eq('estado', 'activa')
        .order('nombre', { ascending: true });

      // Aplicar filtros
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }

      if (filtros.ciudad) {
        query = query.eq('ciudad', filtros.ciudad);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error obteniendo entidades públicas:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo entidades públicas:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Actualizar entidad
   */
  actualizarEntidad: async (entidadId, updates, usuarioId) => {
    try {
      // Verificar permisos
      const tienePermiso = await entidadesService.verificarPermisos(
        usuarioId, 
        entidadId, 
        ['admin', 'editor']
      );

      if (!tienePermiso) {
        return { 
          success: false, 
          error: 'No tienes permisos para editar esta entidad', 
          data: null 
        };
      }

      const { data, error } = await supabase
        .from('entidades')
        .update({
          ...updates,
          actualizado_en: new Date().toISOString(),
          actualizado_por: usuarioId
        })
        .eq('id', entidadId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error actualizando entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Entidad actualizada:', entidadId);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción actualizando entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Eliminar entidad (cambia estado a oculta)
   */
  eliminarEntidad: async (entidadId, usuarioId) => {
    try {
      // Solo admin puede eliminar
      const tienePermiso = await entidadesService.verificarPermisos(
        usuarioId, 
        entidadId, 
        ['admin']
      );

      if (!tienePermiso) {
        return { 
          success: false, 
          error: 'Solo el administrador puede eliminar la entidad', 
          data: null 
        };
      }

      const { data, error } = await supabase
        .from('entidades')
        .update({
          estado: 'oculta',
          visibilidad: 'oculta',
          eliminado_en: new Date().toISOString(),
          eliminado_por: usuarioId
        })
        .eq('id', entidadId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error eliminando entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log('✅ Entidad eliminada (oculta):', entidadId);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción eliminando entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ========== GESTIÓN DE PERMISOS ==========
  
  /**
   * Verificar permisos de usuario sobre entidad
   */
  verificarPermisos: async (usuarioId, entidadId, rolesPermitidos = ['admin']) => {
    try {
      const { data, error } = await supabase
        .from('relaciones_entidades')
        .select('rol')
        .eq('usuario_id', usuarioId)
        .eq('entidad_id', entidadId)
        .single();

      if (error || !data) {
        return false;
      }

      return rolesPermitidos.includes(data.rol);

    } catch (error) {
      console.error('❌ Excepción verificando permisos:', error);
      return false;
    }
  },

  /**
   * Agregar usuario a entidad con rol específico
   */
  agregarUsuarioAEntidad: async (entidadId, usuarioId, rol, adminId) => {
    try {
      // Verificar que el admin tiene permisos
      const esAdmin = await entidadesService.verificarPermisos(
        adminId, 
        entidadId, 
        ['admin']
      );

      if (!esAdmin) {
        return { 
          success: false, 
          error: 'Solo administradores pueden agregar usuarios', 
          data: null 
        };
      }

      const relacion = {
        usuario_id: usuarioId,
        entidad_id: entidadId,
        rol: rol,
        asignado_por: adminId,
        creado_en: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('relaciones_entidades')
        .insert([relacion])
        .select()
        .single();

      if (error) {
        console.error('❌ Error agregando usuario a entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Usuario ${usuarioId} agregado a entidad ${entidadId} como ${rol}`);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción agregando usuario a entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Eliminar usuario de entidad
   */
  eliminarUsuarioDeEntidad: async (entidadId, usuarioId, adminId) => {
    try {
      // Verificar que el admin tiene permisos y no se elimina a sí mismo
      const esAdmin = await entidadesService.verificarPermisos(
        adminId, 
        entidadId, 
        ['admin']
      );

      if (!esAdmin) {
        return { 
          success: false, 
          error: 'Solo administradores pueden eliminar usuarios', 
          data: null 
        };
      }

      // No permitir eliminar al último admin
      if (usuarioId === adminId) {
        const { data: admins } = await supabase
          .from('relaciones_entidades')
          .select('usuario_id')
          .eq('entidad_id', entidadId)
          .eq('rol', 'admin');

        if (admins.length <= 1) {
          return { 
            success: false, 
            error: 'No puedes eliminarte si eres el único administrador', 
            data: null 
          };
        }
      }

      const { error } = await supabase
        .from('relaciones_entidades')
        .delete()
        .eq('entidad_id', entidadId)
        .eq('usuario_id', usuarioId);

      if (error) {
        console.error('❌ Error eliminando usuario de entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Usuario ${usuarioId} eliminado de entidad ${entidadId}`);
      return { success: true, data: null, error: null };

    } catch (error) {
      console.error('❌ Excepción eliminando usuario de entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Obtener usuarios de una entidad
   */
  obtenerUsuariosDeEntidad: async (entidadId, usuarioId) => {
    try {
      // Verificar que el usuario tiene acceso a la entidad
      const tieneAcceso = await entidadesService.verificarPermisos(
        usuarioId, 
        entidadId, 
        ['admin', 'editor', 'lector']
      );

      if (!tieneAcceso) {
        return { 
          success: false, 
          error: 'No tienes acceso a esta entidad', 
          data: null 
        };
      }

      const { data, error } = await supabase
        .from('relaciones_entidades')
        .select(`
          rol,
          creado_en,
          usuario:usuarios(id, nombre_usuario, email, nombre, apellidos)
        `)
        .eq('entidad_id', entidadId);

      if (error) {
        console.error('❌ Error obteniendo usuarios de entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo usuarios de entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  // ========== SEGUIDORES Y VIP ==========
  
  /**
   * Seguir una entidad
   */
  seguirEntidad: async (entidadId, usuarioId) => {
    try {
      const relacion = {
        usuario_id: usuarioId,
        entidad_id: entidadId,
        rol: 'seguidor',
        creado_en: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('relaciones_entidades')
        .insert([relacion])
        .select()
        .single();

      if (error) {
        console.error('❌ Error siguiendo entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Usuario ${usuarioId} sigue ahora a entidad ${entidadId}`);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción siguiendo entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Dejar de seguir una entidad
   */
  dejarDeSeguirEntidad: async (entidadId, usuarioId) => {
    try {
      const { error } = await supabase
        .from('relaciones_entidades')
        .delete()
        .eq('entidad_id', entidadId)
        .eq('usuario_id', usuarioId)
        .eq('rol', 'seguidor');

      if (error) {
        console.error('❌ Error dejando de seguir entidad:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Usuario ${usuarioId} dejó de seguir entidad ${entidadId}`);
      return { success: true, data: null, error: null };

    } catch (error) {
      console.error('❌ Excepción dejando de seguir entidad:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Marcar seguidor como VIP
   */
  marcarComoVIP: async (entidadId, usuarioId, adminId) => {
    try {
      // Solo admin puede marcar como VIP
      const esAdmin = await entidadesService.verificarPermisos(
        adminId, 
        entidadId, 
        ['admin']
      );

      if (!esAdmin) {
        return { 
          success: false, 
          error: 'Solo administradores pueden marcar como VIP', 
          data: null 
        };
      }

      const { data, error } = await supabase
        .from('relaciones_entidades')
        .update({ rol: 'vip' })
        .eq('entidad_id', entidadId)
        .eq('usuario_id', usuarioId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error marcando como VIP:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Usuario ${usuarioId} marcado como VIP en entidad ${entidadId}`);
      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción marcando como VIP:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  /**
   * Obtener seguidores de una entidad
   */
  obtenerSeguidores: async (entidadId, usuarioId, soloVIP = false) => {
    try {
      // Verificar que el usuario tiene acceso (admin/editor)
      const tieneAcceso = await entidadesService.verificarPermisos(
        usuarioId, 
        entidadId, 
        ['admin', 'editor']
      );

      if (!tieneAcceso) {
        return { 
          success: false, 
          error: 'Solo administradores y editores pueden ver seguidores', 
          data: null 
        };
      }

      let query = supabase
        .from('relaciones_entidades')
        .select(`
          rol,
          creado_en,
          usuario:usuarios(id, nombre_usuario, email, nombre, apellidos)
        `)
        .eq('entidad_id', entidadId)
        .in('rol', ['seguidor', 'vip']);

      if (soloVIP) {
        query = query.eq('rol', 'vip');
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error obteniendo seguidores:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data, error: null };

    } catch (error) {
      console.error('❌ Excepción obteniendo seguidores:', error);
      return { success: false, error: error.message, data: null };
    }
  }
};