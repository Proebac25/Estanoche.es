
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function probeColumns() {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    // Intentamos un insert con creador_id para ver si falla en el siguiente campo obligatorio
    const { error } = await supabase.from('eventos').insert({ creador_id: fakeId }).select();
    console.log('Error message:', error ? error.message : 'No error');
    
    // Si no falla, intentamos ver qué campos tiene el objeto devuelto (si RLS lo permite)
    const { data } = await supabase.from('eventos').select('*').limit(1);
    if (data && data.length > 0) console.log('Columns:', Object.keys(data[0]));
}

probeColumns();
