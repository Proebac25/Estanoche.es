import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function testVIP() {
    const payload = {
        titulo: 'Test VIP Error',
        descripcion: 'Test',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        ubicacion: 'Test',
        localidad: 'Test',
        provincia: 'Test',
        precio_actual: 'Gratis',
        tipo: 'evento',
        visibilidad: 'publico', // Esto es lo que enviamos desde React
        app_origen: 'estanoche',
        estado: 'activo',
        creador_id: '22d38251-e96f-4aa2-9425-8f7a2676878a',
        creador_nombre: 'Test',
        modificador_id: '22d38251-e96f-4aa2-9425-8f7a2676878a',
        modificador_nombre: 'Test'
    };

    console.log("Enviando payload:", payload);
    const { data, error } = await supabase.from('eventos').insert([payload]);
    
    if (error) {
        console.error("ERROR DE INSERCIÓN:");
        console.error(error);
    } else {
        console.log("ÉXITO:", data);
        // Clean up
        await supabase.from('eventos').delete().eq('id', data[0].id);
    }
}

testVIP();
