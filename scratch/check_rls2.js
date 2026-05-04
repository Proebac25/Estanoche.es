import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function checkRLS() {
    // Intentaremos usar rpc o query normal
    const { data, error } = await supabase.rpc('get_policies_for_table', { table_name: 'redes_sociales' });
    console.log("RPC Error:", error);
    
    // Si no podemos, simplemente leamos un evento
    const { data: redes, error: err } = await supabase.from('redes_sociales').select('*').limit(5);
    console.log("Redes (anon):", err || redes);
}

checkRLS();
