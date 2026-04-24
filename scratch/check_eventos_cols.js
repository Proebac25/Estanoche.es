
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log('🔍 Buscando columnas de la tabla eventos...');
    
    // Intentamos usar SQL directo si tenemos el RPC 'exec_sql' o similar, 
    // pero como no sabemos si existe, usaremos una técnica de error forzado.
    
    const { error } = await supabase.from('eventos').select('non_existent_column_to_force_error').limit(1);
    
    if (error) {
        console.log('Mensaje de error:', error.message);
        console.log('Detalle:', error.details);
        console.log('Sugerencia de Supabase suele listar columnas válidas.');
    } else {
        console.log('No hubo error (raro).');
    }
}

checkColumns();
