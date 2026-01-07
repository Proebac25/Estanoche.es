import { supabase } from '../lib/supabase'; // Asegúrate de que la ruta sea correcta
const EVENTS_TABLE = 'citas'; // <<< REEMPLAZA 'citas' con el nombre real de tu tabla de eventos/citas

/**
 * Añade un nuevo evento/cita a la base de datos.
 * @param {object} eventData - Objeto con los datos del evento (asunto, fecha, etc.).
 */
export const addEvent = async (eventData) => {
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .insert([eventData])
    .select(); // Devolvemos el registro insertado

  if (error) {
    console.error('Error al añadir el evento:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data[0] };
};

/**
 * Función de ejemplo para obtener todos los eventos del usuario logueado.
 */
export const getEventsByUser = async (userId) => {
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .select('*')
    .eq('user_id', userId) // Filtra solo los eventos creados por el usuario
    .order('fecha', { ascending: true });

  if (error) {
    console.error('Error al obtener los eventos:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

// **Nota:** Aquí añadirías funciones como updateEvent, deleteEvent, etc.