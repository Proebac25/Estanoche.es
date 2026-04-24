import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function checkEvents() {
    console.log("Buscando los últimos eventos insertados...");
    const { data, error } = await supabase
        .from('eventos')
        .select('id, titulo, creador_nombre, created_at, ubicacion, lugar_manual, provincia, localidad')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.table(data);
    }
}

checkEvents();
