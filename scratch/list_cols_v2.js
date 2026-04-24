
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listCols() {
    const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'eventos';" 
    });
    // Si exec_sql no existe, probaremos otra cosa
    if (error) {
        console.log('RPC exec_sql no disponible. Intentando vía query normal si RLS lo permite.');
        const { data: d2, error: e2 } = await supabase.from('eventos').select().limit(0);
        console.log('Error o Datos:', e2 || d2);
    } else {
        console.log('Columnas:', data);
    }
}

listCols();
