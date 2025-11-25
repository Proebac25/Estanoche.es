import { supabase } from '../supabase.js'

export const usersAPI = {
  async crearUsuario(usuarioData) {
    const { data, error } = await supabase
      .from('usuarios')  // ← Cambia por tu tabla real
      .insert([usuarioData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async obtenerUsuarioPorEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
    
    return { data, error }
  }
}