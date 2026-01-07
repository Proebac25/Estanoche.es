
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://grehdbulpfgtphrvemup.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ Falta SUPABASE_SERVICE_ROLE_KEY en .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('🔍 Verificando columnas nuevas en tabla usuarios...');

    // Intentamos seleccionar las columnas nuevas
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, apellidos, calle, codigo_postal, avatar_url')
        .limit(1);

    if (error) {
        console.error('❌ ERROR: Las columnas NO parecen existir o hay un error de permisos.');
        console.error('Detalle:', error.message);
    } else {
        console.log('✅ ÉXITO: Las columnas existen y son accesibles.');
        console.log('Muestra (si hay datos):', data);
    }
}

verify();
