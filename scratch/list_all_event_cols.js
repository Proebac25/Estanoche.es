
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllColumns() {
    // Intentamos obtener una fila real para ver las claves
    const { data, error } = await supabase.from('eventos').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]));
    } else {
        console.log('No data in table to inspect columns.');
        // Fallback: intentar ver los campos de un insert fallido con objeto vacío
        const { error: err2 } = await supabase.from('eventos').insert({}).select();
        console.log('Error hint on empty insert:', err2 ? err2.message : 'No error');
    }
}

listAllColumns();
