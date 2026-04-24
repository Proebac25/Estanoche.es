import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function checkBoth() {
    console.log("=== EVENTOS ===");
    const { data: eData } = await supabase
        .from('eventos')
        .select('id, titulo, entidad_id, entidad_local_id, entidad_amenizador_id, lugar_manual, amenizador, ubicacion, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
    console.table(eData);

    console.log("=== EVENTOS ANALISIS ===");
    const { data: eaData } = await supabase
        .from('eventos_analisis')
        .select('id, titulo, entidad_id, entidad_local_id, entidad_amenizador_id, lugar_manual, amenizador, ubicacion, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
    console.table(eaData);
}

checkBoth();
