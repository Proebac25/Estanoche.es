import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase
        .from('eventos')
        .select(`
            id, 
            titulo,
            lugar_manual,
            amenizador,
            entidad_local:entidades!entidad_local_id(nombre),
            entidad_amenizador:entidades!entidad_amenizador_id(nombre)
        `)
        .limit(3);

    if (error) {
        console.error('Error with exact relationship:', error.message);
        
        // Try fallback
        const { data: d2, error: e2 } = await supabase
            .from('eventos')
            .select(`
                id, 
                titulo,
                entidad_local_id,
                entidad_amenizador_id
            `)
            .limit(3);
        console.log('Fallback data:', d2);
    } else {
        console.log('Data with join:', JSON.stringify(data, null, 2));
    }
}
run();
