import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function checkAnalisis() {
    console.log("Buscando en eventos_analisis...");
    const { data, error } = await supabase
        .from('eventos_analisis')
        .select('id, titulo, lugar_manual, ubicacion, amenizador')
        .order('id', { ascending: false })
        .limit(2);

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.table(data);
    }
}

checkAnalisis();
