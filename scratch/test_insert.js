import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
    const payload = {
        titulo: 'Test Event',
        descripcion: 'Test Description',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        categoria_id: 1,
        ubicacion: 'Test Location',
        localidad: 'Varios',
        provincia: 'Varios',
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

    console.log("Intentando insertar:", payload);
    const { data, error } = await supabase.from('eventos').insert([payload]);
    
    if (error) {
        console.error("ERROR DE INSERCIÓN:");
        console.error(error);
    } else {
        console.log("INSERCIÓN EXITOSA:");
        console.log(data);
    }
}

testInsert();
