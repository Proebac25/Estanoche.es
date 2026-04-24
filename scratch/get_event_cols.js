
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listColumns() {
    const { data, error } = await supabase.from('eventos').select('*').limit(1);
    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns found:', Object.keys(data[0]));
    } else {
        // Si no hay datos, intentamos forzar error para ver columnas en la sugerencia
        const { error: err2 } = await supabase.from('eventos').select('invalid_col').limit(1);
        console.log('Error hint (should list columns):', err2.message);
    }
}

listColumns();
