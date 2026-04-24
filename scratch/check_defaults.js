import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function checkDefaults() {
    console.log("Comprobando defauts...");
    // Intentaremos insertar un registro sin creador_id para ver si falla por NOT NULL o si falla intentando insertar el current_user
    const payload = {
        titulo: 'Test Default',
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
        estado: 'activo'
    };

    console.log("Enviando payload sin creador_id...");
    const { data, error } = await supabase.from('eventos').insert([payload]);
    
    if (error) {
        console.error("ERROR:");
        console.error(error);
    } else {
        console.log("ÉXITO:", data);
    }
}

checkDefaults();
