import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Try to find the keys
const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("No Supabase credentials found.");
    process.exit(1);
}

const supabase = createClient(url, key);

async function checkTriggers() {
    console.log("Comprobando triggers...");
    
    // We can query the pg_catalog directly if we use rpc, but let's just try to insert a minimal event.
    // If it fails with "invalid input syntax for type uuid: 'miguelgd'", we know there's a trigger.
    
    const payload = {
        titulo: 'Test Triggers',
        descripcion: 'Test',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        ubicacion: 'Test',
        localidad: 'Test',
        provincia: 'Test',
        precio_actual: 'Gratis',
        tipo: 'evento',
        visibilidad: 'publico',
        app_origen: 'estanoche',
        estado: 'activo',
        creador_id: '22d38251-e96f-4aa2-9425-8f7a2676878a',
        creador_nombre: 'miguelgd',
        modificador_id: '22d38251-e96f-4aa2-9425-8f7a2676878a',
        modificador_nombre: 'miguelgd'
    };

    console.log("Enviando payload:", payload);
    const { data, error } = await supabase.from('eventos').insert([payload]);
    
    if (error) {
        console.error("ERROR DE INSERCIÓN:");
        console.error(error);
    } else {
        console.log("INSERCIÓN EXITOSA:");
        console.log(data);
    }
}

checkTriggers();
