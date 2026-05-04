import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Usar las variables correctas
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    // Tomar el ultimo evento
    const { data: eventos } = await supabase.from('eventos').select('id').order('created_at', { ascending: false }).limit(1);
    if (!eventos || eventos.length === 0) {
        console.log("No eventos found");
        return;
    }
    const eventoId = eventos[0].id;
    console.log("Trying to insert social for event:", eventoId);

    const { data, error } = await supabase.from('redes_sociales').insert({
        propietario_id: eventoId,
        tipo_propietario: 'evento',
        tipo_red: 'entradas',
        url: 'https://test.com'
    });

    console.log("Insert result:", { data, error });
}

testInsert();
