// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://grehdbulpfgtphrvemup.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_NY3z8RN2s1lH3d4qV6JsMg_cPuTnehx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'apikey': SUPABASE_PUBLIC_KEY
    }
  }
});

// Función para manejar errores
export const handleSupabaseError = (error, context = '') => {
  console.error(`❌ Error en ${context}:`, error);
  
  if (error.code) console.error('Código:', error.code);
  if (error.message) console.error('Mensaje:', error.message);
  if (error.details) console.error('Detalles:', error.details);
  if (error.hint) console.error('Sugerencia:', error.hint);
  
  return null;
};

// Función para verificar si un nombre de usuario existe
export const verificarNombreUsuario = async (nombreUsuario) => {
  if (!nombreUsuario || nombreUsuario.length < 3) {
    return { existe: null, error: 'Nombre de usuario demasiado corto' };
  }
  
  try {
    const { data, error } = await supabase
      .rpc('nombre_usuario_existe', { 
        nombre_usuario_buscar: nombreUsuario.toLowerCase() 
      });

    if (error) {
      console.error('Error RPC nombre_usuario_existe:', error);
      return { 
        existe: null, 
        error: 'Error al verificar el nombre de usuario' 
      };
    }

    return { existe: data === true, error: null };
  } catch (error) {
    console.error('Excepción en verificarNombreUsuario:', error);
    return { 
      existe: null, 
      error: 'Error de conexión' 
    };
  }
};

// Función para verificar si un email existe
export const verificarEmail = async (email) => {
  if (!email) return { existe: null, error: 'Email no proporcionado' };
  
  try {
    const { data, error } = await supabase
      .rpc('email_existe', { 
        email_buscar: email.toLowerCase() 
      });

    if (error) {
      console.error('Error RPC email_existe:', error);
      return { 
        existe: null, 
        error: 'Error al verificar el email' 
      };
    }

    return { existe: data === true, error: null };
  } catch (error) {
    console.error('Excepción en verificarEmail:', error);
    return { 
      existe: null, 
      error: 'Error de conexión' 
    };
  }
};

// Función para verificar si un teléfono existe
export const verificarTelefono = async (telefono) => {
  if (!telefono) return { existe: false, error: null };
  
  const telefonoLimpio = telefono.replace(/\s/g, '');
  
  try {
    const { data, error } = await supabase
      .rpc('telefono_existe', { 
        telefono_buscar: telefonoLimpio 
      });

    if (error) {
      console.error('Error RPC telefono_existe:', error);
      return { 
        existe: null, 
        error: 'Error al verificar el teléfono' 
      };
    }

    return { 
      existe: data === true, 
      error: data === true ? 'Este teléfono ya está registrado' : null 
    };
  } catch (error) {
    console.error('Excepción en verificarTelefono:', error);
    return { 
      existe: null, 
      error: 'Error de conexión' 
    };
  }
};

export default supabase;