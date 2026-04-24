import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function checkTables() {
    console.log("Buscando tablas que empiecen por 'eventos_'...");
    
    // Podemos intentar hacer un query a la base de datos o simplemente intentar leer de eventos_historial
    const { error: err1 } = await supabase.from('eventos_historial').select('id').limit(1);
    if (!err1) console.log("¡La tabla 'eventos_historial' EXISTE!");
    else console.log("Error en eventos_historial:", err1.message);

    const { error: err2 } = await supabase.from('eventos_h').select('id').limit(1);
    if (!err2) console.log("¡La tabla 'eventos_h' EXISTE!");
    else console.log("Error en eventos_h:", err2.message);
}

checkTables();
