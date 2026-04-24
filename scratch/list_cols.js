
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCols() {
    // Intentamos seleccionar una fila para ver las claves
    const { data, error } = await supabase.from('eventos').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Columnas encontradas:', Object.keys(data[0]));
    } else {
        console.log('No hay datos en eventos para inferir columnas.');
        // Si no hay datos, forzamos un error de columna inexistente para que Postgres nos de la lista
        const { error: err2 } = await supabase.from('eventos').select('get_all_columns_please');
        console.log('Error detallado:', err2.message);
    }
}

checkCols();
