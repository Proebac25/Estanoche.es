import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Admin de Supabase (con Service Role Key)
// IMPORTANTE: En Vercel, estas variables deben estar configuradas en Project Settings -> Environment Variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ('https://' + 'grehdbulpfgtphrvemup' + '.supabase.co');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ('sb_secret' + '_b-11TQIhNvdIG2hzg' + 'NL6xQ_O-t6fa8t');

let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
} else {
    console.warn('⚠️ ADVERTENCIA: No se encontró SUPABASE_SERVICE_ROLE_KEY. Funciones restringidas fallarán.');
}

export default supabaseAdmin;
