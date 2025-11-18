import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tu-proyecto.supabase.co'  // ← Cambia por tu URL real
const supabaseAnonKey = 'tu-anon-key-aquí'             // ← Cambia por tu anon key real

export const supabase = createClient(supabaseUrl, supabaseAnonKey)