import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function testDataType() {
    console.log("Probando tipo de dato real de creador_nombre...");
    
    // Test 1: creador_nombre with a UUID
    const payload1 = {
        titulo: 'Test Type',
        descripcion: 'Test',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        ubicacion: 'Test',
        precio_actual: 'Gratis',
        tipo: 'evento',
        visibilidad: 'publico',
        app_origen: 'estanoche',
        estado: 'activo',
        creador_id: '22d38251-e96f-4aa2-9425-8f7a2676878a',
        creador_nombre: '22d38251-e96f-4aa2-9425-8f7a2676878a', // Is it really a UUID?
        modificador_id: '22d38251-e96f-4aa2-9425-8f7a2676878a',
        modificador_nombre: '22d38251-e96f-4aa2-9425-8f7a2676878a'
    };

    console.log("Insertando con UUID en creador_nombre...");
    const { data, error } = await supabase.from('eventos').insert([payload1]);
    
    if (error) {
        console.error("ERROR:");
        console.error(error);
    } else {
        console.log("¡ÉXITO! Entonces creador_nombre ES un UUID en la base de datos.");
    }
}

testDataType();
